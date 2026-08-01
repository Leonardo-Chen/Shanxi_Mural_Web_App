"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { useCanvasBounds } from "./useCanvasBounds";
import { useReducedMotion } from "./useReducedMotion";

export interface CanvasPosition {
  x: number;
  y: number;
}

export interface UseDraggableCanvasOptions {
  canvasWidth: number;
  canvasHeight: number;
  initialCenter: { x: number; y: number };
  enabled?: boolean;
  onPositionChange?: (pos: CanvasPosition) => void;
}

const FRICTION = 0.95; // 0.95 摩擦力，滑动距离更长、质感更高级
const MIN_VELOCITY = 0.15; // 更加平滑的停止阈值

export function useDraggableCanvas({
  canvasWidth,
  canvasHeight,
  initialCenter,
  enabled = true,
  onPositionChange,
}: UseDraggableCanvasOptions) {
  const reducedMotion = useReducedMotion();
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState<CanvasPosition>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // 核心坐标引用，用于高性能动画渲染
  const targetPosRef = useRef<CanvasPosition>({ x: 0, y: 0 });
  const currentPosRef = useRef<CanvasPosition>({ x: 0, y: 0 });
  const velocityRef = useRef<CanvasPosition>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const inertiaActiveRef = useRef<boolean>(false);
  const dragStartRef = useRef<CanvasPosition>({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  const { applyEdgeResistance, centerOn, clampPosition, hardBounds } = useCanvasBounds({
    canvasWidth,
    canvasHeight,
    viewportWidth: viewportSize.width || 1,
    viewportHeight: viewportSize.height || 1,
  });

  useEffect(() => {
    const update = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // 初始定位
  useEffect(() => {
    if (viewportSize.width > 0 && !initialized) {
      const initial = centerOn(initialCenter.x, initialCenter.y);
      targetPosRef.current = { ...initial };
      currentPosRef.current = { ...initial };
      setPosition(initial);
      setInitialized(true);
    }
  }, [viewportSize, initialCenter, centerOn, initialized]);

  // 高性能一帧一渲染：集成 LERP 平滑跟随和弹簧阻尼惯性
  useEffect(() => {
    let active = true;

    const loop = () => {
      if (!active) return;

      // 1. 惯性物理模拟
      if (inertiaActiveRef.current && !reducedMotion) {
        // 速度衰减
        velocityRef.current.x *= FRICTION;
        velocityRef.current.y *= FRICTION;

        // 越界时施加弹簧拉力将其拉回
        let snapForceX = 0;
        let snapForceY = 0;
        const SPRING_K = 0.15; // 弹簧弹性系数

        if (targetPosRef.current.x > hardBounds.maxX) {
          snapForceX = (hardBounds.maxX - targetPosRef.current.x) * SPRING_K;
        } else if (targetPosRef.current.x < hardBounds.minX) {
          snapForceX = (hardBounds.minX - targetPosRef.current.x) * SPRING_K;
        }

        if (targetPosRef.current.y > hardBounds.maxY) {
          snapForceY = (hardBounds.maxY - targetPosRef.current.y) * SPRING_K;
        } else if (targetPosRef.current.y < hardBounds.minY) {
          snapForceY = (hardBounds.minY - targetPosRef.current.y) * SPRING_K;
        }

        velocityRef.current.x += snapForceX;
        velocityRef.current.y += snapForceY;

        const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y);
        const isInsideHardBounds =
          targetPosRef.current.x >= hardBounds.minX &&
          targetPosRef.current.x <= hardBounds.maxX &&
          targetPosRef.current.y >= hardBounds.minY &&
          targetPosRef.current.y <= hardBounds.maxY;

        // 判定停止
        if (speed < MIN_VELOCITY && isInsideHardBounds) {
          inertiaActiveRef.current = false;
          velocityRef.current = { x: 0, y: 0 };
        }

        // 即使低于最小速度，如果在边界外也需要继续微调回弹
        if (speed < MIN_VELOCITY && !isInsideHardBounds) {
          if (Math.abs(snapForceX) > 0.01) velocityRef.current.x = snapForceX;
          if (Math.abs(snapForceY) > 0.01) velocityRef.current.y = snapForceY;
        }

        targetPosRef.current.x += velocityRef.current.x;
        targetPosRef.current.y += velocityRef.current.y;
      }

      // 2. 差值插值运算 (LERP)：拖拽时 LERP 为 0.15 保持灵敏贴手，滑动惯性时 0.10 实现奶油般丝滑长距离阻尼
      const lerpFactor = isDraggingRef.current ? 0.16 : 0.11;
      const dx = targetPosRef.current.x - currentPosRef.current.x;
      const dy = targetPosRef.current.y - currentPosRef.current.y;

      if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
        currentPosRef.current.x += dx * lerpFactor;
        currentPosRef.current.y += dy * lerpFactor;

        // 渲染视口，带阻尼软边界限制
        const clamped = clampPosition(currentPosRef.current.x, currentPosRef.current.y, true);
        setPosition(clamped);
        onPositionChange?.(clamped);
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
    return () => {
      active = false;
    };
  }, [hardBounds, clampPosition, onPositionChange, reducedMotion]);

  // 手势事件监听
  const bind = useDrag(
    ({ movement: [mx, my], velocity: [vx, vy], direction: [dirX, dirY], last, first }) => {
      if (!enabled) return;

      if (first) {
        inertiaActiveRef.current = false;
        isDraggingRef.current = true;
        setIsDragging(true);
        hasDraggedRef.current = false;
        dragStartRef.current = { ...targetPosRef.current };
        velocityRef.current = { x: 0, y: 0 };
      }

      if (Math.hypot(mx, my) > 3) {
        hasDraggedRef.current = true;
      }

      // 更新目标终点位置（附带边缘阻力）
      const rawX = dragStartRef.current.x + mx;
      const rawY = dragStartRef.current.y + my;
      targetPosRef.current = applyEdgeResistance(rawX, rawY);

      if (last) {
        isDraggingRef.current = false;
        setIsDragging(false);
        
        // 抓取并计算手势方向、末端瞬时速度
        if (Math.hypot(mx, my) > 5) {
          velocityRef.current = {
            x: vx * dirX * 18,
            y: vy * dirY * 18,
          };
          inertiaActiveRef.current = true;
        } else {
          velocityRef.current = { x: 0, y: 0 };
        }
      }
    },
    {
      filterTaps: true,
      pointer: { touch: true },
    }
  );

  const navigateTo = useCallback(
    (pointX: number, pointY: number, animate = true) => {
      inertiaActiveRef.current = false;
      velocityRef.current = { x: 0, y: 0 };
      const target = centerOn(pointX, pointY);

      if (!animate || reducedMotion) {
        targetPosRef.current = { ...target };
        currentPosRef.current = { ...target };
        setPosition(target);
        onPositionChange?.(target);
        return;
      }

      // 只需简单重置目标位置，统一的 LERP 渲染循环会带来优雅至极的缓动滑移效果
      targetPosRef.current = target;
    },
    [centerOn, reducedMotion, onPositionChange]
  );

  const forceSetPosition = useCallback(
    (pos: CanvasPosition) => {
      inertiaActiveRef.current = false;
      velocityRef.current = { x: 0, y: 0 };
      targetPosRef.current = { ...pos };
      currentPosRef.current = { ...pos };
      setPosition(pos);
      onPositionChange?.(pos);
    },
    [onPositionChange]
  );

  return {
    position,
    positionRef: currentPosRef,
    isDragging,
    initialized,
    viewportSize,
    bind,
    navigateTo,
    clampPosition,
    setPosition: forceSetPosition,
    hasDraggedRef,
  };
}
