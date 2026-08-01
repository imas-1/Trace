import { useEffect, useState, type RefObject } from 'react';

const PHONE_W = 340;
const PHONE_H = 700;

function viewportSize(): { w: number; h: number } {
  if (window.visualViewport) {
    return { w: window.visualViewport.width, h: window.visualViewport.height };
  }
  return { w: window.innerWidth, h: window.innerHeight };
}

/** Computes a scale factor so the fixed-size phone always fits the visible viewport, no scrolling required. */
export function useFitScreen(titleRef: RefObject<HTMLElement>): number {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function recompute() {
      const titleH = (titleRef.current?.offsetHeight ?? 0) + 10;
      const { w, h } = viewportSize();
      const availW = w * 0.92;
      const availH = h - titleH - 16;
      setScale(Math.max(0.1, Math.min(availW / PHONE_W, availH / PHONE_H, 1)));
    }
    recompute();
    window.addEventListener('resize', recompute);
    window.addEventListener('orientationchange', recompute);
    window.visualViewport?.addEventListener('resize', recompute);
    const timers = [50, 150, 300, 600, 1000].map((ms) => setTimeout(recompute, ms));
    return () => {
      window.removeEventListener('resize', recompute);
      window.removeEventListener('orientationchange', recompute);
      window.visualViewport?.removeEventListener('resize', recompute);
      timers.forEach(clearTimeout);
    };
  }, [titleRef]);

  return scale;
}

export const PHONE_WIDTH = PHONE_W;
export const PHONE_HEIGHT = PHONE_H;
