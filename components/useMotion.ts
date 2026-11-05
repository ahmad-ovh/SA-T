"use client";
import { useEffect, useRef, useState } from "react";

/** Shared, frame-rate-independent timing for illustrative diagrams.
 * The clock suspends in background tabs and on reduced-motion devices.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function useAnimationClock(active: boolean, speed: number, onTick: (seconds: number) => void) {
  const tick = useRef(onTick);
  useEffect(() => { tick.current = onTick; }, [onTick]);
  useEffect(() => {
    if (!active) return;
    let frameId = 0;
    let previous: number | null = null;
    const frame = (now: number) => {
      // No accumulated jump after switching tabs or a dropped frame.
      if (document.hidden) previous = null;
      else if (previous !== null) tick.current(Math.min((now - previous) / 1000, 0.05) * speed);
      if (!document.hidden) previous = now;
      frameId = window.requestAnimationFrame(frame);
    };
    frameId = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(frameId);
  }, [active, speed]);
}

export function smoothstep(edge0: number, edge1: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return x * x * (3 - 2 * x);
}

/** Interpolates a change of illustrative shape without continuous ambient sway. */
export function useAnimatedNumber(target: number, duration = 560) {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) { valueRef.current = target; setValue(target); return; }
    const startValue = valueRef.current;
    if (Math.abs(startValue - target) < .001) return;
    let start: number | null = null;
    let frame = 0;
    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.max(0, Math.min(1, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      valueRef.current = startValue + (target - startValue) * eased;
      setValue(valueRef.current);
      if (t < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target, duration, reduced]);
  return value;
}
