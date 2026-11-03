import { useEffect, useRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  tw: number;
};

/** Fundo acadêmico: constelação de partículas (diferente da home e do login). */
export function StudentConstellationBackground({
  children,
  className = '',
}: Props) {
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
    let my = 0.45;
    let tx = 0.5;
    let ty = 0.45;
    let t = 0;
    const stars: Star[] = [];
    const sparks: Array<{ x: number; y: number; life: number; vx: number; vy: number }> =
      [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = root.clientWidth;
      h = root.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(90, Math.floor((w * h) / 14000));
      while (stars.length < count) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.15 - Math.random() * 0.45,
          r: 1.2 + Math.random() * 2.2,
          tw: Math.random() * Math.PI * 2,
        });
      }
      stars.length = count;
    };

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      tx = (e.clientX - rect.left) / rect.width;
      ty = (e.clientY - rect.top) / rect.height;
    };

    const onClick = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12;
        sparks.push({
          x: cx,
          y: cy,
          life: 1,
          vx: Math.cos(a) * (1.8 + Math.random()),
          vy: Math.sin(a) * (1.8 + Math.random()),
        });
      }
    };

    const draw = () => {
      t += 0.016;
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;

      const bg = ctx.createRadialGradient(
        mx * w,
        my * h,
        40,
        w * 0.5,
        h * 0.55,
        Math.max(w, h) * 0.85,
      );
      bg.addColorStop(0, '#1e1038');
      bg.addColorStop(0.45, '#0f0820');
      bg.addColorStop(1, '#05030c');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Faixas diagonais suaves (papel acadêmico / caderno)
      ctx.save();
      ctx.globalAlpha = 0.04;
      ctx.strokeStyle = '#c4b5fd';
      ctx.lineWidth = 1;
      for (let i = -h; i < w + h; i += 42) {
        ctx.beginPath();
        ctx.moveTo(i + mx * 30, 0);
        ctx.lineTo(i - h + my * 20, h);
        ctx.stroke();
      }
      ctx.restore();

      const cx = mx * w;
      const cy = my * h;

      for (const s of stars) {
        const dx = cx - s.x;
        const dy = cy - s.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 180) {
          s.vx += (dx / dist) * 0.02;
          s.vy += (dy / dist) * 0.02;
        }
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.99;
        s.vy *= 0.99;
        s.tw += 0.04;
        if (s.y < -10) s.y = h + 10;
        if (s.y > h + 10) s.y = -10;
        if (s.x < -10) s.x = w + 10;
        if (s.x > w + 10) s.x = -10;
      }

      // Ligações de constelação
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i];
          const b = stars[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(196, 181, 253, ${0.22 * (1 - d / 110)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (const s of stars) {
        const pulse = 0.55 + Math.sin(s.tw) * 0.35;
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
        g.addColorStop(0, `rgba(250, 245, 255, ${0.9 * pulse})`);
        g.addColorStop(0.4, `rgba(167, 139, 250, ${0.55 * pulse})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Halo no cursor
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160);
      halo.addColorStop(0, 'rgba(167, 139, 250, 0.22)');
      halo.addColorStop(1, 'transparent');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life *= 0.92;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(233, 213, 255, ${p.life})`;
        ctx.fill();
        if (p.life < 0.05) sparks.splice(i, 1);
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
