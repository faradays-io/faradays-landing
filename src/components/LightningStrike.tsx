import { useEffect, useRef, useState } from "react";

const P = 4;
const SCALE = 2;
const snap = (v: number) => Math.round(v / P) * P;

interface Point {
  x: number;
  y: number;
}

/**
 * Generates a jagged pixel-grid-aligned lightning path from origin to target.
 * Uses only H/V segments for retro pixel look.
 */
const generateBoltPath = (
  startX: number,
  startY: number,
  endX: number,
  endY: number
): Point[] => {
  const points: Point[] = [{ x: snap(startX), y: snap(startY) }];
  const dx = endX - startX;
  const dy = endY - startY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const segments = Math.max(6, Math.floor(dist / 40));

  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    // Base position along the line
    const baseX = startX + dx * t;
    const baseY = startY + dy * t;
    // Perpendicular offset for jaggedness (stronger in middle, weaker at ends)
    const spread = Math.sin(t * Math.PI) * 35;
    const offsetX = (Math.random() - 0.5) * spread * 2;
    const offsetY = (Math.random() - 0.5) * spread;
    points.push({
      x: snap(baseX + offsetX),
      y: snap(baseY + offsetY),
    });
  }

  points.push({ x: snap(endX), y: snap(endY) });
  return points;
};

/** Draw a pixel-perfect line using only H/V steps */
const drawPixelLine = (
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  thickness: number
) => {
  const sx0 = snap(x0),
    sy0 = snap(y0),
    sx1 = snap(x1),
    sy1 = snap(y1);
  const dx = Math.abs(sx1 - sx0);
  const dy = Math.abs(sy1 - sy0);
  const stepX = sx1 > sx0 ? P : -P;
  const stepY = sy1 > sy0 ? P : -P;
  let x = sx0,
    y = sy0;
  let err = dx - dy;
  const t = thickness / SCALE;

  while (true) {
    ctx.fillRect(x / SCALE, y / SCALE, t, t);
    if (x === sx1 && y === sy1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += stepX;
    } else if (e2 < dx) {
      err += dx;
      y += stepY;
    }
  }
};

/** Draw the full bolt path with layered glow */
const drawBolt = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  intensity: number
) => {
  if (points.length < 2 || intensity <= 0) return;

  const flicker = intensity > 0.5 ? (Math.random() > 0.15 ? 1 : 0.3) : 1;
  const I = intensity * flicker;

  // Dim base layer
  ctx.globalAlpha = 0.15 + I * 0.2;
  ctx.fillStyle = `rgba(255,255,255,${0.3 + I * 0.3})`;
  ctx.shadowBlur = 0;
  for (let i = 0; i < points.length - 1; i++) {
    drawPixelLine(ctx, points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, P);
  }

  // Glow layer
  ctx.globalAlpha = I * 0.6;
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = (25 * I) / SCALE;
  ctx.fillStyle = `rgba(255,255,255,${I * 0.8})`;
  for (let i = 0; i < points.length - 1; i++) {
    drawPixelLine(ctx, points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, P * 2);
  }
  ctx.shadowBlur = 0;

  // Bright core
  ctx.globalAlpha = Math.min(1, I * 1.2);
  ctx.fillStyle = `rgba(255,255,255,${Math.min(1, I * 1.3)})`;
  for (let i = 0; i < points.length - 1; i++) {
    drawPixelLine(ctx, points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, P);
  }

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
};

interface LightningStrikeProps {
  /** Ref to the title element so we can target the bolt */
  targetRef: React.RefObject<HTMLElement | null>;
  /** Called when bolt impacts (for title glow effect) */
  onStrike?: (intensity: number) => void;
}

const LightningStrike = ({ targetRef, onStrike }: LightningStrikeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w / SCALE);
      canvas.height = Math.floor(h / SCALE);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    window.addEventListener("resize", resize);

    // Animation timing
    const cycleDuration = 180; // frames per cycle
    const travelPhase = 0.35; // bolt travels to target
    const strikePhase = 0.20; // impact flash
    const fadePhase = 0.25;   // fade out
    const pausePhase = 0.20;  // dark pause before next
    let frame = 0;
    let boltPath: Point[] = [];
    let branchPaths: Point[][] = [];

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;

      // Target position: center-left of the title element
      let targetX = 160;
      let targetY = 100;
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        targetX = rect.left + rect.width * 0.4;
        targetY = rect.top + rect.height * 0.5;
      }

      const cycleFrame = frame % cycleDuration;
      const progress = cycleFrame / cycleDuration;

      // Regenerate bolt path at start of each cycle
      if (cycleFrame === 0) {
        boltPath = generateBoltPath(0, 0, targetX, targetY);
        // Generate 1-2 small branches
        branchPaths = [];
        const numBranches = 1 + Math.floor(Math.random() * 2);
        for (let b = 0; b < numBranches; b++) {
          const branchIdx = Math.floor(boltPath.length * (0.3 + Math.random() * 0.4));
          if (branchIdx < boltPath.length) {
            const origin = boltPath[branchIdx];
            const branchEndX = origin.x + (Math.random() - 0.5) * 80;
            const branchEndY = origin.y + Math.random() * 60;
            branchPaths.push(generateBoltPath(origin.x, origin.y, branchEndX, branchEndY));
          }
        }
      }

      if (progress < travelPhase) {
        // Bolt traveling from origin to target
        const t = progress / travelPhase;
        // Stepped reveal for retro feel
        const stepped = Math.floor(t * 10) / 10;
        const visibleCount = Math.max(2, Math.ceil(stepped * boltPath.length));
        const visiblePath = boltPath.slice(0, visibleCount);

        const tipIntensity = 0.6 + t * 0.4;
        drawBolt(ctx, visiblePath, tipIntensity);

        // Branches appear near end of travel
        if (t > 0.6) {
          const branchI = (t - 0.6) / 0.4;
          for (const branch of branchPaths) {
            const bVisible = Math.max(2, Math.ceil(branchI * branch.length));
            drawBolt(ctx, branch.slice(0, bVisible), branchI * 0.5);
          }
        }

        onStrike?.(0);
      } else if (progress < travelPhase + strikePhase) {
        // Impact! Full bolt visible with max intensity
        const t = (progress - travelPhase) / strikePhase;
        const intensity = t < 0.2 ? t / 0.2 : (Math.random() > 0.2 ? 1 : 0.4);

        drawBolt(ctx, boltPath, intensity);
        for (const branch of branchPaths) {
          drawBolt(ctx, branch, intensity * 0.6);
        }

        // Impact flash at target
        if (intensity > 0.3) {
          ctx.globalAlpha = intensity * 0.5;
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = (60 * intensity) / SCALE;
          ctx.fillStyle = `rgba(255,255,255,${intensity * 0.4})`;
          ctx.beginPath();
          ctx.arc(
            snap(targetX) / SCALE,
            snap(targetY) / SCALE,
            (30 + intensity * 25) / SCALE,
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }

        onStrike?.(intensity);
      } else if (progress < travelPhase + strikePhase + fadePhase) {
        // Fade out
        const t = (progress - travelPhase - strikePhase) / fadePhase;
        const fadeIntensity = Math.max(0, 1 - t * 1.5);
        const flickerOut = t > 0.4 ? (Math.random() > 0.5 ? fadeIntensity : 0) : fadeIntensity;

        drawBolt(ctx, boltPath, flickerOut);
        for (const branch of branchPaths) {
          drawBolt(ctx, branch, flickerOut * 0.4);
        }

        onStrike?.(flickerOut * 0.3);
      } else {
        // Pause - darkness
        onStrike?.(0);
      }

      frame++;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [targetRef, onStrike]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none"
      style={{ zIndex: 40, imageRendering: "pixelated" }}
    />
  );
};

export default LightningStrike;
