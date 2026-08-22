const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

const GIT = path.join(__dirname, ".git");
const OUT = __dirname;
const SKIP = new Set([".git", ".next", "node_modules", "_restore.js"]);

function objPath(hash) {
  return path.join(GIT, "objects", hash.slice(0, 2), hash.slice(2));
}

function readLoose(hash) {
  const f = objPath(hash);
  if (!fs.existsSync(f)) return null;
  const raw = zlib.inflateSync(fs.readFileSync(f));
  const nul = raw.indexOf(0);
  const [type] = raw.slice(0, nul).toString().split(" ");
  return { type, body: raw.slice(nul + 1) };
}

let packCache = null;
function loadPack() {
  if (packCache) return packCache;
  const packDir = path.join(GIT, "objects", "pack");
  if (!fs.existsSync(packDir)) return (packCache = new Map());
  const packs = fs.readdirSync(packDir).filter((n) => n.endsWith(".pack"));
  const map = new Map();
  for (const name of packs) {
    const pack = fs.readFileSync(path.join(packDir, name));
    const idxPath = path.join(packDir, name.replace(/\.pack$/, ".idx"));
    if (!fs.existsSync(idxPath)) continue;
    const idx = fs.readFileSync(idxPath);
    parseIdxV2(idx, pack, map);
  }
  packCache = map;
  return map;
}

function parseIdxV2(idx, pack, map) {
  // 8 byte magic + version
  if (idx.readUInt32BE(0) !== 0xff744f63) return;
  const fanout = 256 * 4;
  const n = idx.readUInt32BE(8 + fanout - 4);
  const shaOff = 8 + fanout;
  const crcOff = shaOff + n * 20;
  const offOff = crcOff + n * 4;
  let largeOff = offOff + n * 4;
  const offsets = [];
  for (let i = 0; i < n; i++) {
    const o = idx.readUInt32BE(offOff + i * 4);
    if (o & 0x80000000) {
      const li = o & 0x7fffffff;
      const hi = idx.readUInt32BE(largeOff + li * 8);
      const lo = idx.readUInt32BE(largeOff + li * 8 + 4);
      offsets.push(hi * 0x100000000 + lo);
    } else offsets.push(o);
  }
  for (let i = 0; i < n; i++) {
    const hash = idx.slice(shaOff + i * 20, shaOff + i * 20 + 20).toString("hex");
    map.set(hash, { pack, offset: offsets[i] });
  }
}

function readPacked(hash) {
  const entry = loadPack().get(hash);
  if (!entry) return null;
  return unpackAt(entry.pack, entry.offset);
}

function readVarint(buf, i) {
  let c = buf[i++];
  let n = c & 0x0f;
  let shift = 4;
  const type = (c >> 4) & 7;
  while (c & 0x80) {
    c = buf[i++];
    n |= (c & 0x7f) << shift;
    shift += 7;
  }
  return { type, size: n, i };
}

function readOfs(buf, i) {
  let c = buf[i++];
  let n = c & 0x7f;
  while (c & 0x80) {
    c = buf[i++];
    n = ((n + 1) << 7) | (c & 0x7f);
  }
  return { n, i };
}

function inflateFrom(buf, i) {
  const inf = zlib.createInflate();
  inf.end(buf.slice(i));
  const chunks = [];
  inf.on("data", (c) => chunks.push(c));
  // sync via zlib.inflate with window - not available; use inflateSync with guess
}

function inflateAt(buf, i) {
  // try increasing slices; zlib header is 2 bytes
  for (let end = Math.min(buf.length, i + 32); end <= buf.length; end = Math.min(buf.length, end * 2)) {
    try {
      const body = zlib.inflateSync(buf.slice(i, end));
      return body;
    } catch (e) {
      if (end === buf.length) throw e;
    }
  }
}

function unpackAt(pack, offset, seen = new Set()) {
  if (seen.has(offset)) throw new Error("delta loop");
  seen.add(offset);
  const { type, i: after } = readVarint(pack, offset);
  if (type >= 1 && type <= 4) {
    const types = { 1: "commit", 2: "tree", 3: "blob", 4: "tag" };
    const body = inflateAt(pack, after);
    return { type: types[type], body };
  }
  if (type === 6) {
    // ofs-delta
    const { n, i } = readOfs(pack, after);
    const base = unpackAt(pack, offset - n, seen);
    const delta = inflateAt(pack, i);
    return { type: base.type, body: applyDelta(base.body, delta) };
  }
  if (type === 7) {
    const baseHash = pack.slice(after, after + 20).toString("hex");
    const base = readObj(baseHash);
    if (!base) throw new Error("missing ref-delta base " + baseHash);
    const delta = inflateAt(pack, after + 20);
    return { type: base.type, body: applyDelta(base.body, delta) };
  }
  throw new Error("unknown pack type " + type);
}

function readDeltaSize(buf, i) {
  let c = buf[i++];
  let n = c & 0x7f;
  let shift = 7;
  while (c & 0x80) {
    c = buf[i++];
    n |= (c & 0x7f) << shift;
    shift += 7;
  }
  return { n, i };
}

function applyDelta(base, delta) {
  let i = 0;
  ({ i } = readDeltaSize(delta, i));
  let size;
  ({ n: size, i } = readDeltaSize(delta, i));
  const out = [];
  let written = 0;
  while (i < delta.length) {
    const cmd = delta[i++];
    if (cmd & 0x80) {
      let cpOff = 0;
      let cpSize = 0;
      if (cmd & 0x01) cpOff |= delta[i++];
      if (cmd & 0x02) cpOff |= delta[i++] << 8;
      if (cmd & 0x04) cpOff |= delta[i++] << 16;
      if (cmd & 0x08) cpOff |= delta[i++] << 24;
      if (cmd & 0x10) cpSize |= delta[i++];
      if (cmd & 0x20) cpSize |= delta[i++] << 8;
      if (cmd & 0x40) cpSize |= delta[i++] << 16;
      if (cpSize === 0) cpSize = 0x10000;
      out.push(base.slice(cpOff, cpOff + cpSize));
      written += cpSize;
    } else if (cmd) {
      out.push(delta.slice(i, i + cmd));
      i += cmd;
      written += cmd;
    } else throw new Error("invalid delta");
  }
  const result = Buffer.concat(out);
  if (result.length !== size) {
    // still return; some implementations ok
  }
  return result;
}

function readObj(hash) {
  return readLoose(hash) || readPacked(hash);
}

function parseTree(body) {
  const entries = [];
  let i = 0;
  while (i < body.length) {
    const sp = body.indexOf(0x20, i);
    const mode = body.slice(i, sp).toString();
    const nul = body.indexOf(0, sp);
    const name = body.slice(sp + 1, nul).toString();
    const hash = body.slice(nul + 1, nul + 21).toString("hex");
    entries.push({ mode, name, hash });
    i = nul + 21;
  }
  return entries;
}

const missing = [];
let files = 0;

function checkoutTree(hash, dir) {
  const obj = readObj(hash);
  if (!obj || obj.type !== "tree") {
    missing.push("tree:" + hash);
    return;
  }
  fs.mkdirSync(dir, { recursive: true });
  for (const ent of parseTree(obj.body)) {
    if (ent.name === "." || ent.name === "..") continue;
    const dest = path.join(dir, ent.name);
    if (ent.mode === "40000") {
      checkoutTree(ent.hash, dest);
    } else {
      const blob = readObj(ent.hash);
      if (!blob) {
        missing.push(ent.name + " " + ent.hash);
        continue;
      }
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, blob.body);
      files++;
    }
  }
}

const COMMIT = process.argv[2] || "4b90c9d86765055973aab53f8e4b79c38c557064";
const commit = readObj(COMMIT);
if (!commit || commit.type !== "commit") {
  console.error("commit not found", COMMIT);
  process.exit(1);
}
const tree = (commit.body.toString().match(/^tree ([0-9a-f]{40})/m) || [])[1];
console.log("checking out", COMMIT.slice(0, 8), "tree", tree);
checkoutTree(tree, OUT);
console.log("wrote", files, "files");
if (missing.length) {
  console.log("missing", missing.length);
  console.log(missing.slice(0, 30).join("\n"));
}
void crypto;
