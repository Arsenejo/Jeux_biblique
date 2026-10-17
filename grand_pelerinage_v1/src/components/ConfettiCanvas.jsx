import React, { useEffect, useRef } from "react";

export function ConfettiCanvas({ active, onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Particules de joie spirituelle : or, émeraude, saphir, blanc pur, rose tendre
    const colors = ["#F4B942", "#159447", "#0756A5", "#FFFFFF", "#F97316", "#10B981", "#E0E7FF"];
    const shapes = ["circle", "star", "leaf", "square"];

    const particles = Array.from({ length: 80 }).map(() => ({
      x: width * (0.3 + Math.random() * 0.4),
      y: height * 0.6,
      vx: (Math.random() - 0.5) * 16,
      vy: -(Math.random() * 14 + 10),
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 8,
      gravity: 0.35,
      friction: 0.98,
      alpha: 1
    }));

    let animId;
    let startTime = Date.now();
    const duration = 2800; // 2.8 secondes de célébration

    function render() {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      particles.forEach((p) => {
        p.vx *= p.friction;
        p.vy = p.vy * p.friction + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRotation;

        if (elapsed > duration * 0.6) {
          p.alpha = Math.max(0, 1 - (elapsed - duration * 0.6) / (duration * 0.4));
        }

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;

          if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === "star") {
            ctx.beginPath();
            ctx.font = `${p.size * 1.5}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("✦", 0, 0);
          } else if (p.shape === "leaf") {
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size / 2, p.size, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          }

          ctx.restore();
        }
      });

      if (alive && elapsed < duration) {
        animId = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999
      }}
    />
  );
}
