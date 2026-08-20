"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { geoArea, geoMercator, geoPath, type GeoProjection } from "d3-geo";
import { gsap } from "gsap";
import type { Feature, FeatureCollection, Geometry, Position } from "geojson";
import { temples, type Temple } from "@/data/temples";
import { templeHasMurals } from "@/data/murals";
import {
  getPrefectureColor,
  prefecturesWithTemples,
  templePrefecture,
} from "@/data/mapRegions";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  locPrefecture,
  locRegionShort,
  locTemple,
} from "@/lib/i18n/localize";

interface ShanxiMapProps {
  onSelectTemple: (templeId: string) => void;
  focusTempleId?: string | null;
}

const VIEW_W = 640;
const VIEW_H = 760;
const MIN_ZOOM = 0.75;
const MAX_ZOOM = 4;
const ZOOM_STEP = 1.25;

/** 北部寺庙点密集，偏移标签避免叠字 */
const LABEL_OFFSET: Record<
  string,
  { dx: number; dy: number; anchor: "start" | "middle" | "end" }
> = {
  gongzhu: { dx: -14, dy: -16, anchor: "end" },
  yanshan: { dx: 14, dy: -14, anchor: "start" },
  foguang: { dx: 14, dy: 18, anchor: "start" },
  duofu: { dx: -12, dy: -14, anchor: "end" },
  longquan: { dx: 12, dy: 16, anchor: "start" },
  huayan: { dx: -14, dy: -14, anchor: "end" },
  shanhua: { dx: 14, dy: 14, anchor: "start" },
  chongfu: { dx: -14, dy: -14, anchor: "end" },
  sandaiwang: { dx: 14, dy: -14, anchor: "start" },
  yongning: { dx: 0, dy: -16, anchor: "middle" },
  yonglegong: { dx: 0, dy: 16, anchor: "middle" },
  shuishen: { dx: 0, dy: -16, anchor: "middle" },
};

type Marker = Temple & { x: number; y: number };

type CityFeature = Feature<Geometry, { name?: string; fullname?: string }>;

interface CityPath {
  name: string;
  d: string;
  hasTemple: boolean;
  hasMuralTemple: boolean;
  labelX: number;
  labelY: number;
}

interface MapTransform {
  x: number;
  y: number;
  k: number;
}

/** geojson.cn 部分市级面绕序相反，会导致 fitExtent 缩到全球 */
function fixPolygonWinding(geo: FeatureCollection): FeatureCollection {
  const features = geo.features.map((feature) => {
    if (geoArea(feature) <= Math.PI) return feature;
    const geometry = feature.geometry;
    if (!geometry) return feature;

    if (geometry.type === "Polygon") {
      return {
        ...feature,
        geometry: {
          ...geometry,
          coordinates: geometry.coordinates.map((ring: Position[]) =>
            [...ring].reverse()
          ),
        },
      };
    }

    if (geometry.type === "MultiPolygon") {
      return {
        ...feature,
        geometry: {
          ...geometry,
          coordinates: geometry.coordinates.map((poly) =>
            poly.map((ring: Position[]) => [...ring].reverse())
          ),
        },
      };
    }

    return feature;
  });

  return { ...geo, features };
}

function clampZoom(k: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, k));
}

export default function ShanxiMap({
  onSelectTemple,
  focusTempleId = null,
}: ShanxiMapProps) {
  const reducedMotion = useReducedMotion();
  const { t, locale } = useLocale();
  const titleId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const regionsRef = useRef<SVGGElement>(null);
  const markersRef = useRef<SVGGElement>(null);
  const [geo, setGeo] = useState<FeatureCollection | null>(null);
  const [hoveredTempleId, setHoveredTempleId] = useState<string | null>(null);
  const [hoveredPrefecture, setHoveredPrefecture] = useState<string | null>(
    null
  );
  const [pressedId, setPressedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [transform, setTransform] = useState<MapTransform>({
    x: 0,
    y: 0,
    k: 1,
  });
  const [isPanning, setIsPanning] = useState(false);

  const selectTimerRef = useRef<number | null>(null);
  const clearHoverTimerRef = useRef<number | null>(null);
  const transformRef = useRef(transform);
  transformRef.current = transform;
  const panRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const gestureMovedRef = useRef(false);
  const pendingSelectRef = useRef<
    | { kind: "temple"; id: string }
    | { kind: "prefecture"; name: string }
    | null
  >(null);

  const [pinnedTempleId, setPinnedTempleId] = useState<string | null>(
    focusTempleId
  );
  const [pinnedPrefecture, setPinnedPrefecture] = useState<string | null>(null);
  const focusedOnceRef = useRef<string | null>(null);
  const zoomTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (focusTempleId) {
      setPinnedTempleId(focusTempleId);
      setPinnedPrefecture(null);
    }
  }, [focusTempleId]);

  const activePrefecture =
    (hoveredTempleId ? templePrefecture[hoveredTempleId] : null) ??
    hoveredPrefecture ??
    pinnedPrefecture ??
    (pinnedTempleId ? templePrefecture[pinnedTempleId] : null) ??
    (focusTempleId ? templePrefecture[focusTempleId] : null);

  const visibleTemples = useMemo(() => {
    if (pinnedTempleId) {
      return temples.filter((t) => t.id === pinnedTempleId);
    }
    if (pinnedPrefecture) {
      return temples.filter((t) => templePrefecture[t.id] === pinnedPrefecture);
    }
    if (focusTempleId) {
      return temples.filter((t) => t.id === focusTempleId);
    }
    return [];
  }, [focusTempleId, pinnedPrefecture, pinnedTempleId]);

  useEffect(() => {
    return () => {
      if (selectTimerRef.current !== null) {
        window.clearTimeout(selectTimerRef.current);
      }
      if (clearHoverTimerRef.current !== null) {
        window.clearTimeout(clearHoverTimerRef.current);
      }
      zoomTweenRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/shanxi.geojson")
      .then((r) => {
        if (!r.ok) throw new Error("failed to load geojson");
        return r.json();
      })
      .then((data: FeatureCollection) => {
        if (!cancelled) setGeo(fixPolygonWinding(data));
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const muralPrefectures = useMemo(() => {
    return new Set(
      temples
        .filter((temple) => templeHasMurals(temple.id))
        .map((temple) => templePrefecture[temple.id])
        .filter(Boolean)
    );
  }, []);

  const { cityPaths, projection } = useMemo(() => {
    if (!geo) return { cityPaths: [] as CityPath[], projection: null };

    const projection: GeoProjection = geoMercator().fitExtent(
      [
        [28, 44],
        [VIEW_W - 28, VIEW_H - 48],
      ],
      geo
    );
    const path = geoPath(projection);

    const cityPaths: CityPath[] = (geo.features as CityFeature[]).map(
      (feature) => {
        const name = feature.properties?.name ?? "";
        const centroid = path.centroid(feature);
        return {
          name,
          d: path(feature) ?? "",
          hasTemple: prefecturesWithTemples.has(name),
          hasMuralTemple: muralPrefectures.has(name),
          labelX: centroid[0],
          labelY: centroid[1],
        };
      }
    );

    return { cityPaths, projection };
  }, [geo, muralPrefectures]);

  const markers: Marker[] = useMemo(() => {
    if (!projection) return [];
    return temples.map((temple) => {
      const pt = projection(temple.coordinates);
      return {
        ...temple,
        x: pt?.[0] ?? 0,
        y: pt?.[1] ?? 0,
      };
    });
  }, [projection]);

  const zoomToMarker = useCallback(
    (marker: Marker, animate: boolean) => {
      const k = 2.7;
      const target = {
        x: (VIEW_W / 2 - marker.x) * k,
        y: (VIEW_H / 2 - marker.y) * k,
        k,
      };

      zoomTweenRef.current?.kill();

      if (!animate || reducedMotion) {
        setTransform(target);
        return;
      }

      const current = transformRef.current;
      const proxy = { x: current.x, y: current.y, k: current.k };
      zoomTweenRef.current = gsap.to(proxy, {
        x: target.x,
        y: target.y,
        k: target.k,
        duration: 0.95,
        ease: "power2.inOut",
        onUpdate: () => {
          setTransform({ x: proxy.x, y: proxy.y, k: proxy.k });
        },
      });
    },
    [reducedMotion]
  );

  const focusMarker = useMemo(
    () => markers.find((item) => item.id === focusTempleId) ?? null,
    [focusTempleId, markers]
  );

  useEffect(() => {
    if (!focusTempleId) {
      focusedOnceRef.current = null;
      return;
    }
    if (!focusMarker) return;
    if (focusedOnceRef.current === focusTempleId) return;
    focusedOnceRef.current = focusTempleId;
    zoomToMarker(focusMarker, true);
  }, [focusMarker, focusTempleId, zoomToMarker]);

  useEffect(() => {
    if (!geo || !regionsRef.current || !markersRef.current) return;

    if (reducedMotion) {
      gsap.set(regionsRef.current.children, { opacity: 1 });
      gsap.set(markersRef.current.children, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        regionsRef.current!.children,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.7,
          stagger: 0.04,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        markersRef.current!.children,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.45,
          stagger: 0.08,
          delay: 0.35,
          ease: "power2.out",
        }
      );
    }, svgRef);

    return () => ctx.revert();
  }, [geo, reducedMotion]);

  const zoomAt = useCallback((nextK: number, focusX: number, focusY: number) => {
    setTransform((prev) => {
      const k = clampZoom(nextK);
      if (k === prev.k) return prev;
      const worldX = (focusX - VIEW_W / 2 - prev.x) / prev.k + VIEW_W / 2;
      const worldY = (focusY - VIEW_H / 2 - prev.y) / prev.k + VIEW_H / 2;
      const x = focusX - VIEW_W / 2 - (worldX - VIEW_W / 2) * k;
      const y = focusY - VIEW_H / 2 - (worldY - VIEW_H / 2) * k;
      return { x, y, k };
    });
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !geo) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const focus = (() => {
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const ctm = svg.getScreenCTM();
        if (!ctm) return { x: VIEW_W / 2, y: VIEW_H / 2 };
        const local = pt.matrixTransform(ctm.inverse());
        return { x: local.x, y: local.y };
      })();
      const prev = transformRef.current;
      const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      zoomAt(prev.k * factor, focus.x, focus.y);
    };

    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [geo, zoomAt]);

  const pinTemple = useCallback(
    (templeId: string) => {
      setPinnedTempleId(templeId);
      setPinnedPrefecture(null);
      setPressedId(templeHasMurals(templeId) ? templeId : null);
      setHoveredTempleId(templeId);
      const marker = markers.find((item) => item.id === templeId);
      if (marker && templeHasMurals(templeId)) zoomToMarker(marker, true);
    },
    [markers, zoomToMarker]
  );

  const pinPrefecture = useCallback((name: string) => {
    setPinnedPrefecture(name);
    setPinnedTempleId(null);
    setHoveredPrefecture(name);
    setHoveredTempleId(null);
  }, []);

  const cancelClearHover = useCallback(() => {
    if (clearHoverTimerRef.current !== null) {
      window.clearTimeout(clearHoverTimerRef.current);
      clearHoverTimerRef.current = null;
    }
  }, []);

  const scheduleClearHover = useCallback(() => {
    cancelClearHover();
    clearHoverTimerRef.current = window.setTimeout(() => {
      setHoveredTempleId(null);
      setHoveredPrefecture(null);
    }, 180);
  }, [cancelClearHover]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (e.button !== 0) return;
      const target = e.target as Element | null;
      const templeId = target
        ?.closest?.("[data-temple-id]")
        ?.getAttribute("data-temple-id");
      const prefecture = target
        ?.closest?.("[data-prefecture]")
        ?.getAttribute("data-prefecture");
      pendingSelectRef.current = templeId
        ? { kind: "temple", id: templeId }
        : prefecture
          ? { kind: "prefecture", name: prefecture }
          : null;
      gestureMovedRef.current = false;
      panRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        originX: transform.x,
        originY: transform.y,
        moved: false,
      };
      if (!pendingSelectRef.current) setIsPanning(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [transform.x, transform.y]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const pan = panRef.current;
      if (!pan || pan.pointerId !== e.pointerId) return;

      const dx = e.clientX - pan.startX;
      const dy = e.clientY - pan.startY;
      if (!pan.moved && Math.hypot(dx, dy) > 4) {
        pan.moved = true;
        gestureMovedRef.current = true;
        pendingSelectRef.current = null;
        setIsPanning(true);
      }
      if (!pan.moved) return;

      const svg = svgRef.current;
      if (!svg) return;
      const scaleX = VIEW_W / svg.clientWidth;
      const scaleY = VIEW_H / svg.clientHeight;

      setTransform((prev) => ({
        ...prev,
        x: pan.originX + dx * scaleX,
        y: pan.originY + dy * scaleY,
      }));
    },
    []
  );

  const endPan = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!panRef.current || panRef.current.pointerId !== e.pointerId) return;
      const moved = panRef.current.moved;
      const pending = pendingSelectRef.current;
      panRef.current = null;
      pendingSelectRef.current = null;
      gestureMovedRef.current = false;
      setIsPanning(false);
      if (moved || !pending) return;
      if (pending.kind === "temple") pinTemple(pending.id);
      else pinPrefecture(pending.name);
    },
    [pinPrefecture, pinTemple]
  );

  const zoomByButton = useCallback(
    (direction: 1 | -1) => {
      const factor = direction > 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      zoomAt(transform.k * factor, VIEW_W / 2, VIEW_H / 2);
    },
    [transform.k, zoomAt]
  );

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, k: 1 });
  }, []);

  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (gestureMovedRef.current) {
      gestureMovedRef.current = false;
      return;
    }
    const target = e.target as HTMLElement | SVGElement;
    if (!target.closest("[data-map-interactive]")) {
      setHoveredPrefecture(null);
      setHoveredTempleId(null);
    }
  }, []);

  const handleSelect = useCallback(
    (templeId: string) => {
      if (!templeHasMurals(templeId)) return;
      onSelectTemple(templeId);
    },
    [onSelectTemple]
  );

  const mapTransform = `translate(${VIEW_W / 2 + transform.x} ${VIEW_H / 2 + transform.y}) scale(${transform.k}) translate(${-VIEW_W / 2} ${-VIEW_H / 2})`;

  const isMapIdle =
    !reducedMotion &&
    !activePrefecture &&
    !hoveredTempleId &&
    !focusTempleId &&
    !pinnedTempleId &&
    !pinnedPrefecture &&
    !isPanning &&
    !pressedId;

  return (
    <div className="fixed inset-0 z-10">
      {loadError && (
        <p className="absolute inset-0 z-10 flex items-center justify-center font-sans text-sm text-ink/50">
          {t("map.loadError")}
        </p>
      )}

      {!geo && !loadError && (
        <p className="absolute inset-0 z-10 flex items-center justify-center font-sans text-sm text-ink/40">
          {t("map.loading")}
        </p>
      )}

      {geo && (
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
          className={`absolute inset-0 h-full w-full touch-none select-none ${
            isPanning ? "cursor-grabbing" : "cursor-grab"
          } ${isMapIdle ? "" : "map-idle-paused"}`}
          role="group"
          aria-labelledby={titleId}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endPan}
          onPointerCancel={endPan}
          onClick={handleSvgClick}
        >
          <g transform={mapTransform}>
            <defs>
              <filter
                id="map-block-shadow"
                x="-12%"
                y="-8%"
                width="130%"
                height="145%"
              >
                <feDropShadow
                  dx="0"
                  dy="2.5"
                  stdDeviation="2"
                  floodColor="#26241F"
                  floodOpacity="0.16"
                />
              </filter>
            </defs>

            <g ref={regionsRef}>
              {[...cityPaths]
                .sort((a, b) => a.labelY - b.labelY)
                .map((city, index) => {
                  const highlighted =
                    activePrefecture != null && city.name === activePrefecture;
                  const muted =
                    activePrefecture != null && city.name !== activePrefecture;
                  const colors = getPrefectureColor(city.name);
                  const depth = highlighted ? 9 : 6;
                  const steps = [depth, depth * 0.7, depth * 0.42, depth * 0.16];

                  return (
                    <g
                      key={city.name}
                      opacity={muted ? 0.42 : 1}
                      className={
                        reducedMotion
                          ? undefined
                          : `map-region-bob ${
                              city.hasMuralTemple
                                ? "map-region-bob--strong"
                                : "map-region-bob--soft"
                            }`
                      }
                      style={
                        reducedMotion
                          ? undefined
                          : {
                              animationDelay: `${(index % 11) * 0.14}s`,
                              transition: reducedMotion
                                ? "none"
                                : "opacity 0.25s ease",
                            }
                      }
                    >
                      {/* 挤出厚度 */}
                      <g aria-hidden="true">
                        {steps.map((dy, i) => (
                          <path
                            key={i}
                            d={city.d}
                            transform={`translate(${1.1 + i * 0.2}, ${dy})`}
                            fill={colors.side}
                            stroke="none"
                          />
                        ))}
                      </g>

                      {/* 顶面 */}
                      <path
                        d={city.d}
                        fill={highlighted ? colors.highlight : colors.fill}
                        stroke="#26241F"
                        strokeWidth={highlighted ? 1.35 : 0.85}
                        strokeLinejoin="round"
                        filter="url(#map-block-shadow)"
                        opacity={city.hasTemple ? 1 : 0.94}
                        data-map-interactive={city.hasTemple ? true : undefined}
                        data-prefecture={city.hasTemple ? city.name : undefined}
                        className={
                          city.hasTemple
                            ? "cursor-pointer"
                            : "pointer-events-none"
                        }
                        onMouseEnter={() => {
                          if (!city.hasTemple) return;
                          cancelClearHover();
                          setHoveredPrefecture(city.name);
                          setHoveredTempleId(null);
                        }}
                        onMouseLeave={scheduleClearHover}
                        onClick={(e) => {
                          if (!city.hasTemple) return;
                          e.stopPropagation();
                          if (gestureMovedRef.current) {
                            gestureMovedRef.current = false;
                            return;
                          }
                          setHoveredPrefecture(city.name);
                          setHoveredTempleId(null);
                        }}
                        style={{
                          transition: reducedMotion
                            ? "none"
                            : "fill 0.25s ease, stroke-width 0.25s ease",
                        }}
                      />

                      <text
                        x={city.labelX}
                        y={city.labelY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="pointer-events-none select-none"
                        fill={city.hasTemple ? "#3E6264" : "#26241F55"}
                        fontSize={city.hasTemple ? 11 : 9}
                        opacity={muted ? 0.45 : 0.8}
                        style={{
                          fontFamily:
                            "var(--font-sans), system-ui, sans-serif",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {locPrefecture(locale, city.name)}
                      </text>
                    </g>
                  );
                })}
            </g>

            <g ref={markersRef}>
              {markers.map((m) => {
                const hasMurals = templeHasMurals(m.id);
                const featured =
                  hasMurals &&
                  (pinnedTempleId === m.id || focusTempleId === m.id);
                const active = hasMurals && hoveredTempleId === m.id;
                const dimmed =
                  !featured &&
                  ((!!hoveredTempleId && hoveredTempleId !== m.id) ||
                    (!!hoveredPrefecture &&
                      templePrefecture[m.id] !== hoveredPrefecture));
                const pressed = hasMurals && pressedId === m.id;
                const offset = LABEL_OFFSET[m.id] ?? {
                  dx: 0,
                  dy: -16,
                  anchor: "middle" as const,
                };
                const r = featured || pressed ? 11 : active ? 9 : hasMurals ? 6.5 : 5.5;
                const marked = featured || active || pressed;

                return (
                  <g
                    key={m.id}
                    transform={`translate(${m.x}, ${m.y})`}
                    data-temple-id={m.id}
                    data-map-interactive="true"
                    className={
                      hasMurals
                        ? "cursor-pointer outline-none"
                        : "cursor-default outline-none"
                    }
                    opacity={hasMurals ? (dimmed ? 0.28 : 1) : dimmed ? 0.2 : 0.55}
                    onMouseEnter={() => {
                      cancelClearHover();
                      setHoveredTempleId(m.id);
                      setHoveredPrefecture(null);
                    }}
                    onMouseLeave={scheduleClearHover}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(m.id);
                    }}
                    role="button"
                    tabIndex={hasMurals ? 0 : -1}
                    aria-disabled={!hasMurals}
                    aria-current={featured ? "true" : undefined}
                    aria-label={
                      hasMurals
                        ? `${locTemple(locale, m).name}，${locRegionShort(locale, m.region)}，${locTemple(locale, m).era}${featured ? `，${t("map.selected")}` : ""}，${t("map.clickEntrance")}`
                        : `${locTemple(locale, m).name}，${t("map.closed")}`
                    }
                    onKeyDown={(e) => {
                      if (!hasMurals) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        pinTemple(m.id);
                      }
                    }}
                    style={{
                      transition: reducedMotion ? "none" : "opacity 0.25s ease",
                    }}
                  >
                    <circle r={22} fill="transparent" />

                    {!reducedMotion && hasMurals && !marked && (
                      <circle
                        r={10}
                        fill="none"
                        stroke="#8B352E"
                        strokeWidth={1}
                        className="map-pulse-ring pointer-events-none"
                      />
                    )}

                    <circle
                      r={r + (featured ? 10 : 7)}
                      fill="#8B352E"
                      opacity={marked ? 0.16 : 0}
                    />
                    <circle
                      r={r}
                      fill={
                        hasMurals
                          ? marked
                            ? "#8B352E"
                            : "#3E6264"
                          : "#9A958C"
                      }
                      stroke={
                        featured ? "#F4E6D8" : hasMurals ? "#EEE8DC" : "#D4CFC6"
                      }
                      strokeWidth={featured ? 2.2 : 1.75}
                    />

                    <text
                      x={offset.dx}
                      y={offset.dy}
                      textAnchor={offset.anchor}
                      className="pointer-events-none select-none"
                      fill={hasMurals ? "#26241F" : "#8A8680"}
                      fontSize={featured || active ? 14 : 12.5}
                      fontWeight={featured || active ? 600 : 400}
                      style={{
                        fontFamily: "var(--font-serif), Songti SC, serif",
                      }}
                    >
                      {locTemple(locale, m).name}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>
        </svg>
      )}

      <div className="pointer-events-none absolute bottom-6 left-5 z-20 flex items-end gap-3 md:bottom-8 md:left-6 md:gap-4">
        <div className="pointer-events-auto flex flex-col gap-1">
          <ZoomButton label={t("map.zoomIn")} onClick={() => zoomByButton(1)}>
            +
          </ZoomButton>
          <ZoomButton label={t("map.zoomOut")} onClick={() => zoomByButton(-1)}>
            −
          </ZoomButton>
          <ZoomButton label={t("map.reset")} onClick={resetView}>
            ⌂
          </ZoomButton>
        </div>
        <div className="max-w-[13rem] pb-0.5 sm:max-w-xs">
          <h2 id={titleId} className="font-serif text-base text-ink md:text-lg">
            {t("map.title")}
          </h2>
          <p className="mt-1 font-serif text-[11px] leading-snug text-ink/65 md:text-xs">
            {t("map.hint")}
          </p>
        </div>
      </div>

      <aside
        className={`absolute right-5 top-1/2 z-30 hidden w-56 -translate-y-1/2 md:right-8 md:block ${
          visibleTemples.length > 0 ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-live="polite"
        aria-label={t("map.entryAria")}
        onMouseEnter={cancelClearHover}
        onMouseLeave={scheduleClearHover}
      >
        <div
          className={`rounded-sm border border-ink/10 bg-rice/90 p-3 shadow-sm backdrop-blur-sm transition-all duration-300 ${
            visibleTemples.length > 0
              ? "translate-x-0 opacity-100"
              : "translate-x-2 opacity-0"
          }`}
        >
          {visibleTemples.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {pinnedPrefecture && !pinnedTempleId && (
                <li className="mb-1 px-1 font-sans text-[10px] tracking-wider text-stone">
                  {locPrefecture(locale, pinnedPrefecture)} · {t("map.templeCount", { count: visibleTemples.length })}
                </li>
              )}
              {visibleTemples.map((temple) => {
                const hasMurals = templeHasMurals(temple.id);
                const copy = locTemple(locale, temple);
                return (
                <li key={temple.id}>
                  <button
                    type="button"
                    disabled={!hasMurals}
                    onClick={() => handleSelect(temple.id)}
                    className={`w-full rounded-sm px-3 py-2.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar ${
                      hasMurals
                        ? "hover:bg-parchment/90"
                        : "cursor-default opacity-55 grayscale"
                    }`}
                  >
                    <span
                      className={`block font-serif text-sm ${
                        hasMurals ? "text-ink" : "text-stone/70"
                      }`}
                    >
                      {copy.name}
                    </span>
                    <span className="mt-0.5 block font-sans text-[10px] tracking-wider text-stone">
                      {locRegionShort(locale, temple.region)} · {copy.era}
                    </span>
                    <span className="mt-1.5 block font-serif text-[11px] leading-snug text-ink/60">
                      {copy.tagline}
                    </span>
                    <span
                      className={`mt-2 block font-sans text-[10px] tracking-wider ${
                        hasMurals ? "text-cinnabar" : "text-stone/45"
                      }`}
                    >
                      {hasMurals ? t("map.enter") : t("map.closed")}
                    </span>
                  </button>
                </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </aside>

      <aside
        className={`pointer-events-none absolute inset-x-4 bottom-20 z-20 md:hidden ${
          visibleTemples.length > 0 ? "opacity-100" : "opacity-0"
        }`}
        aria-live="polite"
      >
        {visibleTemples.length > 0 && (
          <div className="pointer-events-auto rounded-sm border border-ink/10 bg-rice/95 p-2 shadow-sm backdrop-blur-sm">
            <ul className="flex gap-2 overflow-x-auto">
              {visibleTemples.map((temple) => {
                const hasMurals = templeHasMurals(temple.id);
                const copy = locTemple(locale, temple);
                return (
                <li key={temple.id} className="shrink-0">
                  <button
                    type="button"
                    disabled={!hasMurals}
                    onClick={() => handleSelect(temple.id)}
                    className={`min-w-[8rem] rounded-sm px-3 py-2 text-left ${
                      hasMurals
                        ? "bg-cinnabar/10"
                        : "cursor-default bg-stone/10 grayscale"
                    }`}
                  >
                    <span
                      className={`block font-serif text-sm ${
                        hasMurals ? "text-ink" : "text-stone/70"
                      }`}
                    >
                      {copy.name}
                    </span>
                    <span className="mt-0.5 block font-sans text-[10px] text-stone">
                      {locRegionShort(locale, temple.region)} · {copy.era}
                    </span>
                    <span
                      className={`mt-1 block font-sans text-[10px] tracking-wider ${
                        hasMurals ? "text-cinnabar" : "text-stone/45"
                      }`}
                    >
                      {hasMurals ? t("map.enter") : t("map.closed")}
                    </span>
                  </button>
                </li>
                );
              })}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}

function ZoomButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink/15 bg-rice/85 font-sans text-base leading-none text-ink/70 backdrop-blur-sm transition-colors hover:border-ink/30 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
    >
      {children}
    </button>
  );
}
