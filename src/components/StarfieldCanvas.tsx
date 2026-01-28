"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  velocityX: number;
  velocityY: number;
  alpha: number;
};

const STAR_COUNT = 220;

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const frameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth * window.devicePixelRatio;
      canvas.height = innerHeight * window.devicePixelRatio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      if (starsRef.current.length === 0) {
        starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
          x: Math.random() * innerWidth,
          y: Math.random() * innerHeight,
          radius: Math.random() * 0.9 + 0.2,
          velocityX: (Math.random() - 0.5) * 0.08,
          velocityY: (Math.random() - 0.5) * 0.06,
          alpha: Math.random() * 0.35 + 0.1
        }));
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(200, 220, 255, 0.18)";

      for (const star of starsRef.current) {
        star.x += star.velocityX;
        star.y += star.velocityY;

        if (star.x < -20) star.x = width + 20;
        if (star.x > width + 20) star.x = -20;
        if (star.y < -20) star.y = height + 20;
        if (star.y > height + 20) star.y = -20;

        context.globalAlpha = star.alpha;
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
