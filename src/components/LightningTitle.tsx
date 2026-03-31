import { useEffect, useRef } from "react";

const LightningTitle = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const title = titleRef.current;
    if (!canvas || !title) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Per-cycle randomized spark rays
    let rayAngles: number[] = [];
    let rayLengths: number[] = [];

    const CYCLE = 200;
    const SWEEP = 0.50;    // beam sweeps across the text
    const FADE_OUT = 0.22; // fade after sweep
    // PAUSE: remaining ~0.28

    let frame = 0;

    const render = () => {
      if (!canvas || !ctx || !title) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rect = title.getBoundingClientRect();
      const textLeft = rect.left;
      const textRight = rect.right;
      const textMidY = rect.top + rect.height * 0.5;

      const cf = frame % CYCLE;
      const prog = cf / CYCLE;

      // Randomize rays at cycle start
      if (cf === 0) {
        const count = 10 + Math.floor(Math.random() * 5);
        rayAngles = Array.from({ length: count }, () => Math.random() * Math.PI * 2);
        rayLengths = Array.from({ length: count }, () => 0.3 + Math.random() * 0.7);
      }

      let impactX = 0;
      let impactY = textMidY;
      let intensity = 0;

      if (prog < SWEEP) {
        const t = prog / SWEEP;
        impactX = textLeft + (textRight - textLeft) * t;
        // Ramp in quickly then hold with flicker
        intensity = t < 0.08 ? t / 0.08 : (Math.random() > 0.12 ? 0.8 + Math.random() * 0.2 : 0.35);
      } else if (prog < SWEEP + FADE_OUT) {
        const t = (prog - SWEEP) / FADE_OUT;
        impactX = textRight;
        intensity = Math.max(0, (1 - t) * (Math.random() > 0.3 ? 1 : 0.25));
      }

      if (intensity > 0.01) {
        // ═══════════════════════════════════
        // 1) MAIN BEAM: upper-left → impact
        // ═══════════════════════════════════
        const beamOriginX = 0;
        const beamOriginY = 0;

        // Wide outer glow (tapered triangle, brighter near impact)
        ctx.save();
        const outerGrad = ctx.createLinearGradient(beamOriginX, beamOriginY, impactX, impactY);
        outerGrad.addColorStop(0,   `rgba(30,  80, 220, ${intensity * 0.08})`);
        outerGrad.addColorStop(0.5, `rgba(60, 140, 255, ${intensity * 0.2})`);
        outerGrad.addColorStop(1,   `rgba(100, 180, 255, ${intensity * 0.45})`);
        ctx.fillStyle = outerGrad;

        // Triangle: thin at origin, wide at impact
        const beamAngle = Math.atan2(impactY - beamOriginY, impactX - beamOriginX);
        const perpX = Math.sin(beamAngle);
        const perpY = -Math.cos(beamAngle);
        const widthAtOrigin = 6 * intensity;
        const widthAtImpact = 35 * intensity;

        ctx.beginPath();
        ctx.moveTo(beamOriginX + perpX * widthAtOrigin, beamOriginY + perpY * widthAtOrigin);
        ctx.lineTo(beamOriginX - perpX * widthAtOrigin, beamOriginY - perpY * widthAtOrigin);
        ctx.lineTo(impactX - perpX * widthAtImpact, impactY - perpY * widthAtImpact);
        ctx.lineTo(impactX + perpX * widthAtImpact, impactY + perpY * widthAtImpact);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Mid beam (medium width, brighter)
        ctx.save();
        ctx.strokeStyle = `rgba(130, 195, 255, ${intensity * 0.7})`;
        ctx.lineWidth = 5 * intensity;
        ctx.shadowColor = `rgba(80, 160, 255, ${intensity})`;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(beamOriginX, beamOriginY);
        ctx.lineTo(impactX, impactY);
        ctx.stroke();
        ctx.restore();

        // Bright core line
        ctx.save();
        ctx.strokeStyle = `rgba(220, 240, 255, ${intensity * 0.9})`;
        ctx.lineWidth = 2 * intensity;
        ctx.shadowColor = `rgba(200, 230, 255, ${intensity})`;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(beamOriginX, beamOriginY);
        ctx.lineTo(impactX, impactY);
        ctx.stroke();
        ctx.restore();

        // ═══════════════════════════════════
        // 2) IMPACT RADIAL GLOW (blue halo)
        // ═══════════════════════════════════
        const glowR = 90 * intensity;
        const radial = ctx.createRadialGradient(impactX, impactY, 0, impactX, impactY, glowR);
        radial.addColorStop(0,    `rgba(255, 255, 255, ${intensity * 0.95})`);
        radial.addColorStop(0.08, `rgba(200, 235, 255, ${intensity * 0.85})`);
        radial.addColorStop(0.25, `rgba(80,  165, 255, ${intensity * 0.5})`);
        radial.addColorStop(0.55, `rgba(30,   80, 220, ${intensity * 0.2})`);
        radial.addColorStop(1,    `rgba(10,   40, 160, 0)`);
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(impactX, impactY, glowR, 0, Math.PI * 2);
        ctx.fill();

        // ═══════════════════════════════════
        // 3) SPARK RAYS from impact
        // ═══════════════════════════════════
        const maxRayLen = 140 * intensity;

        for (let i = 0; i < rayAngles.length; i++) {
          const angle = rayAngles[i];
          const len = maxRayLen * rayLengths[i];
          const endX = impactX + Math.cos(angle) * len;
          const endY = impactY + Math.sin(angle) * len;

          // Slight jag at midpoint
          const jag = 10 * (Math.random() - 0.5);
          const midX = impactX + Math.cos(angle) * len * 0.4 + Math.sin(angle) * jag;
          const midY = impactY + Math.sin(angle) * len * 0.4 - Math.cos(angle) * jag;

          const rayA = intensity * (0.5 + Math.random() * 0.5);

          // Outer glow of ray
          ctx.save();
          ctx.strokeStyle = `rgba(150, 210, 255, ${rayA * 0.7})`;
          ctx.lineWidth = 1.5 + Math.random() * 2;
          ctx.shadowColor = `rgba(100, 180, 255, ${rayA})`;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(impactX, impactY);
          ctx.lineTo(midX, midY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          ctx.restore();

          // Bright white core of ray
          ctx.save();
          ctx.strokeStyle = `rgba(255, 255, 255, ${rayA * 0.75})`;
          ctx.lineWidth = 0.6 + Math.random() * 0.6;
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 3;
          ctx.beginPath();
          ctx.moveTo(impactX, impactY);
          ctx.lineTo(midX, midY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          ctx.restore();
        }

        // ═══════════════════════════════════
        // 4) BRIGHT WHITE CORE at impact
        // ═══════════════════════════════════
        ctx.save();
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 18;
        const coreR = 6 * intensity;
        const coreGrad = ctx.createRadialGradient(impactX, impactY, 0, impactX, impactY, coreR);
        coreGrad.addColorStop(0, `rgba(255,255,255,${intensity})`);
        coreGrad.addColorStop(1, `rgba(200,230,255,0)`);
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(impactX, impactY, coreR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ═══════════════════════════════════
      // 5) TEXT GLOW via direct DOM
      // ═══════════════════════════════════
      if (title) {
        title.style.textShadow = intensity > 0.05
          ? `0 0 ${12 + intensity * 45}px rgba(100, 180, 255, ${intensity * 0.9}),
             0 0 ${5  + intensity * 22}px rgba(255, 255, 255, ${intensity * 0.7})`
          : "none";
      }

      frame++;
      animId = requestAnimationFrame(render);
    };

    // Wait for font to load then start
    document.fonts.ready.then(() => {
      resize();
      render();
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      if (title) title.style.textShadow = "none";
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
        style={{ zIndex: 40 }}
      />
      <h1
        ref={titleRef}
        className="font-pixel text-2xl sm:text-4xl md:text-5xl tracking-wide text-page-foreground relative"
        style={{ zIndex: 50 }}
      >
        Faradays
      </h1>
    </>
  );
};

export default LightningTitle;
