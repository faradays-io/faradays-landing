import { useEffect, useRef } from "react";

const P = 4; // pixel grid size

const snap = (v: number) => Math.round(v / P) * P;

const ElectricWire = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const SCALE = 2; // draw at half res, CSS scales up for chunky pixels

    const resize = () => {
      const w = window.innerWidth;
      const h = 120;
      canvas.width = Math.floor(w / SCALE);
      canvas.height = Math.floor(h / SCALE);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    window.addEventListener("resize", resize);

    const ELECTRIC = "#ffffff";
    const ELECTRIC_DIM = "rgba(255,255,255,";

    // Draw a single pixel-grid-aligned rectangle
    const drawPixel = (x: number, y: number, size: number) => {
      ctx.fillRect(snap(x) / SCALE, snap(y) / SCALE, size / SCALE, size / SCALE);
    };

    // Draw a pixel-perfect line between two points using only H/V steps
    const drawPixelLine = (x0: number, y0: number, x1: number, y1: number, thickness: number) => {
      const sx0 = snap(x0), sy0 = snap(y0), sx1 = snap(x1), sy1 = snap(y1);
      const dx = Math.abs(sx1 - sx0);
      const dy = Math.abs(sy1 - sy0);
      const stepX = sx1 > sx0 ? P : -P;
      const stepY = sy1 > sy0 ? P : -P;
      let x = sx0, y = sy0;
      let err = dx - dy;

      const t = thickness / SCALE;
      while (true) {
        ctx.fillRect(x / SCALE, y / SCALE, t, t);
        if (x === sx1 && y === sy1) break;
        const e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x += stepX; }
        else if (e2 < dx) { err += dx; y += stepY; }
      }
    };

    // Pixel lightning bolt using only axis-aligned segments
    const drawLightningBolt = (cx: number, bottomY: number, height: number, charge: number) => {
      if (!ctx) return;
      const h = height;
      const topY = bottomY - h;
      const p = P;

      // Zigzag bolt as pixel segments: top to middle-left, jog right, down to bottom
      const segments = [
        // Top piece going down-left
        { x: cx + 2 * p, y: topY },
        { x: cx + p, y: topY + 2 * p },
        { x: cx, y: topY + 4 * p },
        { x: cx - p, y: topY + 5 * p },
        { x: cx - 2 * p, y: topY + 6 * p },
        // Jog right (the middle bar)
        { x: cx + 2 * p, y: topY + 6 * p },
        // Bottom piece going down-left  
        { x: cx + p, y: topY + 8 * p },
        { x: cx, y: topY + 10 * p },
        { x: cx - p, y: topY + 11 * p },
        { x: cx - 2 * p, y: topY + 12 * p },
        { x: cx - 3 * p, y: bottomY },
      ];

      const thickness = P;

      // Dim base
      const baseAlpha = 0.1 + charge * 0.02;
      ctx.globalAlpha = baseAlpha;
      ctx.fillStyle = `${ELECTRIC_DIM}${0.3 + charge * 0.2})`;
      for (let i = 0; i < segments.length - 1; i++) {
        drawPixelLine(segments[i].x, segments[i].y, segments[i + 1].x, segments[i + 1].y, thickness);
      }

      if (charge > 0.05) {
        const flicker = charge > 0.5 ? (Math.random() > 0.2 ? 1 : 0.4) : 1;

        // Glow layer
        ctx.globalAlpha = charge * 0.7 * flicker;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = (30 * charge) / SCALE;
        ctx.fillStyle = `rgba(255,255,255,${charge * 0.9 * flicker})`;
        for (let i = 0; i < segments.length - 1; i++) {
          drawPixelLine(segments[i].x, segments[i].y, segments[i + 1].x, segments[i + 1].y, thickness * 2);
        }
        ctx.shadowBlur = 0;

        // Bright core
        ctx.globalAlpha = Math.min(1, charge * 1.2) * flicker;
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, charge * 1.2) * flicker})`;
        for (let i = 0; i < segments.length - 1; i++) {
          drawPixelLine(segments[i].x, segments[i].y, segments[i + 1].x, segments[i + 1].y, thickness);
        }

        // Halo
        ctx.globalAlpha = charge * 0.4 * flicker;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = (50 * charge) / SCALE;
        ctx.fillStyle = `rgba(255,255,255,${charge * 0.5})`;
        const haloX = snap(cx) / SCALE;
        const haloY = snap(topY + h * 0.45) / SCALE;
        const haloR = (20 + charge * 20) / SCALE;
        ctx.beginPath();
        ctx.arc(haloX, haloY, haloR, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    // Generate stepped pixel line (only H/V movement)
    const generateRetroLine = (startX: number, endX: number, baseY: number) => {
      const points: { x: number; y: number }[] = [];
      let x = startX;
      while (x < endX) {
        const step = P * (2 + Math.floor(Math.random() * 4));
        const jag = Math.round((Math.random() - 0.5) * 20 / P) * P;
        points.push({ x: snap(x), y: snap(baseY + jag) });
        x += step;
      }
      points.push({ x: snap(endX), y: snap(baseY) });
      return points;
    };

    const cycleDuration = 150;
    const growPhase = 0.5;
    const dischargePhase = 0.2;
    const fadePhase = 0.3;
    let frame = 0;
    let linePoints: { x: number; y: number }[] = [];
    let stutterTimer = 0;
    let frozen = false;

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = 1;

      const baseY = 60;
      const wireEnd = Math.floor(window.innerWidth * 0.75);
      const boltCx = wireEnd;

      const cycleFrame = frame % cycleDuration;
      const cycleProgress = cycleFrame / cycleDuration;

      stutterTimer--;
      if (stutterTimer <= 0 && !frozen) {
        linePoints = generateRetroLine(0, wireEnd, baseY);
        if (Math.random() < 0.15) {
          frozen = true;
          stutterTimer = Math.floor(Math.random() * 12) + 4;
        } else {
          stutterTimer = Math.random() < 0.3 ? 1 : Math.floor(Math.random() * 4) + 2;
        }
      }
      if (frozen) {
        stutterTimer--;
        if (stutterTimer <= 0) frozen = false;
      }

      let lineAlpha = 1;
      let clipX = wireEnd;
      let charge = 0;

      if (cycleProgress < growPhase) {
        const t = cycleProgress / growPhase;
        const stepped = Math.floor(t * 8) / 8 + (Math.random() * 0.04);
        clipX = Math.min(stepped, 1) * wireEnd;
        lineAlpha = 0.5 + t * 0.5;
        charge = 0;
      } else if (cycleProgress < growPhase + dischargePhase) {
        const t = (cycleProgress - growPhase) / dischargePhase;
        clipX = wireEnd;
        lineAlpha = 1;
        charge = t < 0.15 ? t / 0.15 : (Math.random() > 0.25 ? 1 : 0.3);
      } else {
        const t = (cycleProgress - growPhase - dischargePhase) / fadePhase;
        clipX = wireEnd;
        lineAlpha = t < 0.3 ? (Math.random() > 0.4 ? 0.7 : 0) : Math.max(0, 1 - t * 1.3);
        charge = Math.max(0, (1 - t * 2));
      }

      const fullFlicker = Math.random() < 0.06 ? 0 : 1;
      lineAlpha *= fullFlicker;

      // Draw pixelated electric current using H/V pixel segments
      if (linePoints.length > 1 && lineAlpha > 0.01) {
        const drawn: { x: number; y: number }[] = [];
        for (const p of linePoints) {
          if (p.x <= clipX) {
            drawn.push(p);
          } else {
            if (drawn.length > 0) {
              drawn.push({ x: snap(clipX), y: drawn[drawn.length - 1].y });
            }
            break;
          }
        }

        if (drawn.length > 1) {
          // Draw stepped: for each pair, go horizontal then vertical
          ctx.globalAlpha = lineAlpha * (0.7 + Math.random() * 0.3);
          ctx.fillStyle = ELECTRIC;
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 3 / SCALE;

          for (let i = 0; i < drawn.length - 1; i++) {
            const a = drawn[i];
            const b = drawn[i + 1];
            // Horizontal segment
            drawPixelLine(a.x, a.y, b.x, a.y, P);
            // Vertical segment
            drawPixelLine(b.x, a.y, b.x, b.y, P);
          }

          // Glow pass
          ctx.globalAlpha = lineAlpha * 0.12;
          ctx.shadowBlur = 8 / SCALE;
          for (let i = 0; i < drawn.length - 1; i++) {
            const a = drawn[i];
            const b = drawn[i + 1];
            drawPixelLine(a.x, a.y, b.x, a.y, P * 2);
            drawPixelLine(b.x, a.y, b.x, b.y, P * 2);
          }

          ctx.shadowBlur = 0;
        }
      }

      drawLightningBolt(boltCx, 120 - 5, 95, charge);

      ctx.globalAlpha = 1;
      frame++;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed bottom-12 left-0 pointer-events-none"
      style={{ height: 120, zIndex: 50, imageRendering: "pixelated" }}
    />
  );
};

export default ElectricWire;
