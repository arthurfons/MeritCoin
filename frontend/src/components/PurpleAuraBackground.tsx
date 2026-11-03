import { useEffect, useRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

/** Fundo roxo com ondas/ripples no cursor (diferente do spotlight da home). */
export function PurpleAuraBackground({ children, className = '' }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let mx = 0.5;
    let my = 0.4;
    let tx = 0.5;
    let ty = 0.4;
    const ripples: Array<{ x: number; y: number; r: number; a: number }> = [];
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = root.clientWidth;
      h = root.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      tx = (e.clientX - rect.left) / rect.width;
      ty = (e.clientY - rect.top) / rect.height;
    };

    const onClick = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        r: 8,
        a: 0.55,
      });
    };

    const draw = () => {
      t += 0.012;
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;

      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#140218');
      g.addColorStop(0.45, '#2a0a33');
      g.addColorStop(1, '#0a0210');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Ondas horizontais que se deformam com o mouse
      for (let i = 0; i < 6; i++) {
        const baseY = h * (0.18 + i * 0.14);
        const amp = 18 + i * 6 + my * 40;
        const phase = t * (0.8 + i * 0.15) + mx * Math.PI * 2;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const n =
            Math.sin(x * 0.008 + phase) * amp +
            Math.sin(x * 0.02 - t * 1.4 + i) * (10 + mx * 20);
          const y = baseY + n;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(192, 132, 252, ${0.08 + i * 0.03})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Aura no cursor
      const cx = mx * w;
      const cy = my * h;
      const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.35);
      aura.addColorStop(0, 'rgba(232, 121, 249, 0.28)');
      aura.addColorStop(0.35, 'rgba(128, 0, 128, 0.18)');
      aura.addColorStop(1, 'transparent');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, w, h);

      // Ripples no clique
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.r += 4.5;
        r.a *= 0.96;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(233, 213, 255, ${r.a})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        if (r.a < 0.03 || r.r > Math.max(w, h)) ripples.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerdown', onClick);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerdown', onClick);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative min-h-screen overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
