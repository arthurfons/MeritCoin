import { useEffect, useRef, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';

export function HomePage() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;
    let targetX = 50;
    let targetY = 40;
    let currentX = 50;
    let currentY = 40;

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      stage.style.setProperty('--mx', `${currentX}%`);
      stage.style.setProperty('--my', `${currentY}%`);
      stage.style.setProperty('--mx2', `${100 - currentX}%`);
      stage.style.setProperty('--my2', `${100 - currentY}%`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 100;
      targetY = ((e.clientY - rect.top) / rect.height) * 100;
    };

    stage.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="home-stage relative min-h-screen overflow-hidden"
      style={
        {
          '--mx': '50%',
          '--my': '40%',
          '--mx2': '50%',
          '--my2': '60%',
        } as CSSProperties
      }
    >
      <div className="home-stage__glow" aria-hidden />
      <div className="home-stage__orb home-stage__orb--a" aria-hidden />
      <div className="home-stage__orb home-stage__orb--b" aria-hidden />
      <div className="home-stage__grid" aria-hidden />
      <div className="home-stage__vignette" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-16">
        <div className="max-w-xl rounded-2xl border border-white/15 bg-white/92 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-purple)]">
            PUC Minas · Projeto de Software
          </p>
          <h1 className="mt-3 text-4xl font-bold text-black">MeritCoin</h1>
          <p className="mt-3 text-neutral-600">
            Auto-cadastro de alunos, professores com 1.000 moedas/semestre,
            vantagens de parceiros e, como extra, missões escolares.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="rounded-xl bg-[var(--color-purple)] px-5 py-3 font-medium text-white transition hover:brightness-110"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro/aluno"
              className="rounded-xl border border-neutral-400 px-5 py-3 font-medium text-neutral-700 transition hover:border-neutral-700"
            >
              Cadastro de aluno
            </Link>
            <Link
              to="/cadastro/empresa"
              className="rounded-xl border border-neutral-400 px-5 py-3 font-medium text-neutral-700 transition hover:border-neutral-700"
            >
              Sou empresa parceira
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
