"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { geoArea, geoMercator, geoPath, type GeoProjection } from "d3-geo";
import { gsap } from "gsap";
import type { Feature, FeatureCollection, Geometry, Position } from "geojson";
import { temples, type Temple } from "@/data/temples";
import {
  getPrefectureColor,
  isMuralTemple,
  prefecturesWithMuralTemples,
  templePrefecture,
} from "@/data/mapRegions";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locTemple } from "@/lib/i18n/localize";

interface ShanxiMapProps {
  onSelectTemple: (templeId: string) => void;
  /** 从壁画详情进入时，定位并高亮该寺观 */
  focusTempleId?: string | null;
}

const VIEW_W = 640;
const VIEW_H = 760;
const MIN_ZOOM = 0.75;
const MAX_ZOOM = 4;
const ZOOM_STEP = 1.25;
const CINNABAR = "#8B352E";
const STONE = "#3E6264";
const INK_MUTED = "#9A948C";
/** 顶部导航遮住一部分，焦点略偏下，落在可视区域中央 */
const FOCUS_NUDGE_Y = 70;
const FOCUS_ZOOM = 2.55;

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
  const { locale, t } = useLocale();
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
  const focusedRef = useRef<string | null>(null);

  const activePrefecture =
    (hoveredTempleId ? templePrefecture[hoveredTempleId] : null) ??
    hoveredPrefecture ??
    (focusTempleId ? templePrefecture[focusTempleId] : null);

  const visibleTemples = useMemo(() => {
    const openTemples = temples.filter((temple) => isMuralTemple(temple.id));
    if (hoveredTempleId && isMuralTemple(hoveredTempleId)) {
      return openTemples.filter((temple) => temple.id === hoveredTempleId);
    }
    if (hoveredPrefecture) {
      return openTemples.filter(
        (temple) => templePrefecture[temple.id] === hoveredPrefecture
      );
    }
    if (focusTempleId && isMuralTemple(focusTempleId)) {
      return openTemples.filter((temple) => temple.id === focusTempleId);
    }
    return [];
  }, [hoveredTempleId, hoveredPrefecture, focusTempleId]);

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
    }, 240);
  }, [cancelClearHover]);

  useEffect(() => {
    return () => {
      if (selectTimerRef.current !== null) {
        window.clearTimeout(selectTimerRef.current);
      }
      if (clearHoverTimerRef.current !== null) {
        window.clearTimeout(clearHoverTimerRef.current);
      }
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
          hasTemple: prefecturesWithMuralTemples.has(name),
          labelX: centroid[0],
          labelY: centroid[1],
        };
      }
    );

    return { cityPaths, projection };
  }, [geo]);

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

  useEffect(() => {
    if (!focusTempleId) {
      focusedRef.current = null;
      return;
    }
    if (markers.length === 0) return;

    const marker = markers.find((item) => item.id === focusTempleId);
    if (!marker) return;
    if (focusedRef.current === focusTempleId) return;
    focusedRef.current = focusTempleId;

    const k = reducedMotion ? 1.9 : FOCUS_ZOOM;
    const next: MapTransform = {
      x: -k * (marker.x - VIEW_W / 2),
      y: FOCUS_NUDGE_Y - k * (marker.y - VIEW_H / 2),
      k,
    };

    if (reducedMotion) {
      setTransform(next);
      return;
    }

    const tween = { ...transformRef.current };
    const animation = gsap.to(tween, {
      x: next.x,
      y: next.y,
      k: next.k,
      duration: 0.85,
      ease: "power2.inOut",
      onUpdate: () => {
        setTransform({ x: tween.x, y: tween.y, k: tween.k });
      },
    });

    return () => {
      animation.kill();
    };
  }, [focusTempleId, markers, reducedMotion]);

  useEffect(() => {
    if (!geo || !regionsRef.current || !markersRef.current) return;

    const openRegions = Array.from(regionsRef.current.children).filter(
      (node) => (node as SVGElement).dataset.muralRegion === "true"
    );
    const openMarkers = Array.from(markersRef.current.children).filter(
      (node) => (node as SVGElement).dataset.muralTemple === "true"
    );

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        openRegions,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.7,
          stagger: 0.04,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(openRegions, { clearProps: "opacity" });
          },
        }
      );

      if (!focusTempleId) {
        gsap.fromTo(
          openMarkers,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.45,
            stagger: 0.08,
            delay: 0.35,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(openMarkers, { clearProps: "opacity" });
            },
          }
        );
      }
    }, svgRef);

    return () => ctx.revert();
  }, [geo, reducedMotion, focusTempleId]);

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

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (e.button !== 0) return;

      gestureMovedRef.current = false;
      panRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        originX: transform.x,
        originY: transform.y,
        moved: false,
      };
      setIsPanning(true);
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
      }

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

  const endPan = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!panRef.current || panRef.current.pointerId !== e.pointerId) return;
    panRef.current = null;
    setIsPanning(false);
  }, []);

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

  const handleSelect = useCallback(
    (templeId: string) => {
      if (!isMuralTemple(templeId)) return;
      if (gestureMovedRef.current) {
        gestureMovedRef.current = false;
        return;
      }
      setPressedId(templeId);
      setHoveredTempleId(templeId);
      if (selectTimerRef.current !== null) {
        window.clearTimeout(selectTimerRef.current);
      }
      if (reducedMotion) {
        onSelectTemple(templeId);
        return;
      }
      selectTimerRef.current = window.setTimeout(() => {
        onSelectTemple(templeId);
      }, 160);
    },
    [onSelectTemple, reducedMotion]
  );

  const mapTransform = `translate(${VIEW_W / 2 + transform.x} ${VIEW_H / 2 + transform.y}) scale(${transform.k}) translate(${-VIEW_W / 2} ${-VIEW_H / 2})`;

  const isMapIdle =
    !reducedMotion &&
    !activePrefecture &&
    !hoveredTempleId &&
    !focusTempleId &&
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
                    city.hasTemple &&
                    activePrefecture != null &&
                    city.name === activePrefecture;
                  const muted = !city.hasTemple;
                  const colors = city.hasTemple
                    ? getPrefectureColor(city.name)
                    : {
                        fill: "#DCD7CE",
                        highlight: "#DCD7CE",
                        side: "#B5AFA6",
                      };
                  const depth = highlighted ? 9 : city.hasTemple ? 6 : 4;
                  const steps = [depth, depth * 0.7, depth * 0.42, depth * 0.16];

                  return (
                    <g
                      key={city.name}
                      data-mural-region={city.hasTemple ? "true" : undefined}
                      opacity={muted ? 0.4 : 1}
                      className={
                        reducedMotion || !city.hasTemple
                          ? undefined
                          : "map-region-bob map-region-bob--strong"
                      }
                      style={
                        reducedMotion || !city.hasTemple
                          ? undefined
                          : {
                              animationDelay: `${(index % 11) * 0.14}s`,
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
                        opacity={city.hasTemple ? 1 : 0.9}
                        data-map-interactive={city.hasTemple ? true : undefined}
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
                        fill={city.hasTemple ? STONE : "#26241F55"}
                        fontSize={city.hasTemple ? 11 : 9}
                        opacity={muted ? 0.55 : 0.8}
                        style={{
                          fontFamily:
                            "var(--font-sans), system-ui, sans-serif",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {city.name}
                      </text>
                    </g>
                  );
                })}
            </g>

            <g ref={markersRef}>
              {markers.map((m) => {
                const copy = locTemple(locale, m);
                const isOpen = isMuralTemple(m.id);
                const isFocused = focusTempleId === m.id;
                const active = isOpen && hoveredTempleId === m.id;
                const pressed = isOpen && pressedId === m.id;
                const featured = isFocused || active || pressed;
                const dimmed = !isOpen
                  ? true
                  : !isFocused &&
                    ((!!hoveredTempleId && hoveredTempleId !== m.id) ||
                      (!!hoveredPrefecture &&
                        templePrefecture[m.id] !== hoveredPrefecture));
                const offset = LABEL_OFFSET[m.id] ?? {
                  dx: 0,
                  dy: -16,
                  anchor: "middle" as const,
                };
                const r = isFocused
                  ? 13
                  : pressed
                    ? 10
                    : active
                      ? 9
                      : isOpen
                        ? 6.5
                        : 4.2;

                return (
                  <g
                    key={m.id}
                    transform={`translate(${m.x}, ${m.y}) scale(${isFocused ? 1.28 : 1})`}
                    data-map-interactive={isOpen ? true : undefined}
                    data-mural-temple={isOpen ? "true" : undefined}
                    className={
                      isOpen
                        ? "cursor-pointer outline-none"
                        : "pointer-events-none outline-none"
                    }
                    opacity={isOpen ? (dimmed ? 0.32 : 1) : 0.38}
                    onMouseEnter={() => {
                      if (!isOpen) return;
                      cancelClearHover();
                      setHoveredTempleId(m.id);
                      setHoveredPrefecture(null);
                    }}
                    onMouseLeave={isOpen ? scheduleClearHover : undefined}
                    onClick={(e) => {
                      if (!isOpen) return;
                      e.stopPropagation();
                      handleSelect(m.id);
                    }}
                    role={isOpen ? "button" : undefined}
                    tabIndex={isOpen ? 0 : -1}
                    aria-label={
                      isOpen
                        ? `${copy.name}，${copy.region}，${copy.era}，${t("map.enter")}`
                        : `${copy.name}，${t("map.closed")}`
                    }
                    onKeyDown={
                      isOpen
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleSelect(m.id);
                            }
                          }
                        : undefined
                    }
                    style={{
                      transition: reducedMotion
                        ? "none"
                        : "opacity 0.25s ease, transform 0.35s ease",
                    }}
                  >
                    <circle r={isFocused ? 28 : 22} fill="transparent" />

                    {isOpen && !reducedMotion && !featured && (
                      <circle
                        r={10}
                        fill="none"
                        stroke={CINNABAR}
                        strokeWidth={1}
                        className="map-pulse-ring pointer-events-none"
                      />
                    )}

                    {isFocused && !reducedMotion && (
                      <circle
                        r={16}
                        fill="none"
                        stroke={CINNABAR}
                        strokeWidth={1.2}
                        className="map-pulse-ring pointer-events-none"
                      />
                    )}

                    <circle
                      r={r + 8}
                      fill={CINNABAR}
                      opacity={featured ? 0.16 : 0}
                    />
                    <circle
                      r={r}
                      fill={
                        !isOpen ? INK_MUTED : featured ? CINNABAR : STONE
                      }
                      stroke={isFocused ? "#F3E6D8" : "#EEE8DC"}
                      strokeWidth={isFocused ? 2.2 : 1.75}
                    />

                    <text
                      x={offset.dx}
                      y={isFocused ? offset.dy - 4 : offset.dy}
                      textAnchor={offset.anchor}
                      className="pointer-events-none select-none"
                      fill={
                        isFocused ? CINNABAR : isOpen ? "#26241F" : "#26241F66"
                      }
                      fontSize={
                        isFocused ? 15 : featured ? 14 : isOpen ? 12.5 : 10
                      }
                      fontWeight={isFocused || featured ? 600 : 400}
                      style={{
                        fontFamily: "var(--font-serif), Songti SC, serif",
                      }}
                    >
                      {copy.name}
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
        </div>
      </div>

      <aside
        className={`absolute right-5 top-1/2 z-20 hidden w-56 -translate-y-1/2 md:right-8 md:block ${
          visibleTemples.length > 0 ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-live="polite"
        aria-label="悬停寺庙信息"
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
              {hoveredPrefecture && !hoveredTempleId && (
                <li className="mb-1 px-1 font-sans text-[10px] tracking-wider text-stone">
                  {hoveredPrefecture} · {visibleTemples.length} 座寺观
                </li>
              )}
              {visibleTemples.map((temple) => {
                const copy = locTemple(locale, temple);
                const selected = temple.id === focusTempleId;
                return (
                <li key={temple.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(temple.id)}
                    className={`w-full rounded-sm px-3 py-2.5 text-left transition-colors hover:bg-parchment/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar ${
                      selected ? "bg-cinnabar/10" : ""
                    }`}
                  >
                    <span className="block font-serif text-sm text-ink">
                      {copy.name}
                    </span>
                    <span className="mt-0.5 block font-sans text-[10px] tracking-wider text-stone">
                      {copy.region.replace(/^山西[·•]\s*/, "")} · {copy.era}
                    </span>
                    <span className="mt-1.5 block font-serif text-[11px] leading-snug text-ink/60">
                      {copy.tagline}
                    </span>
                    <span className="mt-2 block font-sans text-[10px] tracking-wider text-cinnabar">
                      {t("map.enter")}
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
                const copy = locTemple(locale, temple);
                return (
                <li key={temple.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSelect(temple.id)}
                    className="min-w-[8rem] rounded-sm bg-cinnabar/10 px-3 py-2 text-left"
                  >
                    <span className="block font-serif text-sm text-ink">
                      {copy.name}
                    </span>
                    <span className="mt-0.5 block font-sans text-[10px] text-stone">
                      {copy.region.replace(/^山西[·•]\s*/, "")} · {copy.era}
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
