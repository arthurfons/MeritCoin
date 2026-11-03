import { useEffect, useRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

/** Fundo parceiro: malha isométrica + feixes (diferente da home, login e aluno). */
export function PartnerLatticeBackground({
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
    let my = 0.5;
    let tx = 0.5;
    let ty = 0.5;
    let t = 0;
    const rings: Array<{ x: number; y: number; r: number; a: number }> = [];

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
      rings.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        r: 12,
        a: 0.7,
      });
    };

    const drawHex = (x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (Math.PI / 3) * i - Math.PI / 6;
        const px = x + Math.cos(ang) * size;
        const py = y + Math.sin(ang) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const draw = () => {
      t += 0.01;
      mx += (tx - mx) * 0.07;
      my += (ty - my) * 0.07;

      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#0a0a0c');
      g.addColorStop(0.4, '#1a0820');
      g.addColorStop(1, '#12060a');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Feixe diagonal que acompanha o mouse
      const beam = ctx.createLinearGradient(
        0,
        my * h * 0.3,
        w,
        h * 0.4 + my * h * 0.4,
      );
      beam.addColorStop(0, 'transparent');
      beam.addColorStop(0.45 + mx * 0.1, 'rgba(251, 191, 36, 0.08)');
      beam.addColorStop(0.55 + mx * 0.05, 'rgba(192, 132, 252, 0.12)');
      beam.addColorStop(1, 'transparent');
      ctx.fillStyle = beam;
      ctx.fillRect(0, 0, w, h);

      const ox = (mx - 0.5) * 40;
      const oy = (my - 0.5) * 30;
      const size = 28;
      const stepX = size * 1.75;
      const stepY = size * 1.52;

      for (let row = -2; row < h / stepY + 3; row++) {
        for (let col = -2; col < w / stepX + 3; col++) {
          const x = col * stepX + (row % 2 ? stepX / 2 : 0) + ox;
          const y = row * stepY + oy;
          const dx = x - mx * w;
          const dy = y - my * h;
          const dist = Math.hypot(dx, dy);
          const near = Math.max(0, 1 - dist / 280);
          const pulse = 0.5 + Math.sin(t * 2 + row * 0.4 + col * 0.3) * 0.5;

          drawHex(x, y, size * (0.85 + near * 0.12));
          ctx.strokeStyle = `rgba(250, 204, 21, ${0.04 + near * 0.18 * pulse})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          if (near > 0.35) {
            ctx.fillStyle = `rgba(128, 0, 128, ${near * 0.08})`;
            ctx.fill();
          }
        }
      }

      // “Moedas” orbitando o cursor
      const cx = mx * w;
      const cy = my * h;
      for (let i = 0; i < 5; i++) {
        const ang = t * (0.7 + i * 0.12) + i * 1.2;
        const rad = 55 + i * 18;
        const px = cx + Math.cos(ang) * rad;
        const py = cy + Math.sin(ang) * rad * 0.55;
        const coin = ctx.createRadialGradient(px, py, 0, px, py, 10);
        coin.addColorStop(0, 'rgba(253, 224, 71, 0.85)');
        coin.addColorStop(0.55, 'rgba(217, 119, 6, 0.45)');
        coin.addColorStop(1, 'transparent');
        ctx.fillStyle = coin;
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.r += 3.2;
        r.a *= 0.955;
        drawHex(r.x, r.y, r.r);
        ctx.strokeStyle = `rgba(253, 224, 71, ${r.a})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        drawHex(r.x, r.y, r.r * 0.72);
        ctx.strokeStyle = `rgba(192, 132, 252, ${r.a * 0.7})`;
        ctx.stroke();
        if (r.a < 0.04 || r.r > Math.max(w, h) * 0.7) rings.splice(i, 1);
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
