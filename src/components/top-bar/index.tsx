 "use client";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

export default function HorseYearTopBar() {
  const t = useTranslations("horseYearTopBar");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvasEl.width = canvasEl.offsetWidth;
      canvasEl.height = canvasEl.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const particles: any[] = [];

    const spawnTokenBurst = () => {
      const x = Math.random() * canvasEl.width;
      const y = Math.random() * canvasEl.height * 0.7;
      const count = 28;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 1.8 + Math.random() * 2.8;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed + 0.8,
          vy: Math.sin(angle) * speed * 0.7,
          life: 90,
          size: 2.2,
          color: ["#FFD700", "#c1121f", "#ffb703"][Math.floor(Math.random() * 3)]
        });
      }
    };

    const burstTimer = setInterval(spawnTokenBurst, 2200);

    const animate = () => {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 90;
        ctx.shadowBlur = 18;
        ctx.shadowColor = p.color;
        ctx.fill();

        if (p.life <= 0) particles.splice(i, 1);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearInterval(burstTimer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative h-[78px] overflow-hidden border-b border-yellow-500/20 bg-slate-950 flex items-center justify-center text-white font-[Inter,system-ui]">

      {/* Lanterns */}
      <Lantern className="left-4 top-2" delay="0s" />
      <Lantern className="right-4 top-2" delay="1.4s" />

      {/* Canvas FX */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Energy Flow */}
      <div className="absolute inset-0 opacity-60 animate-flow bg-[linear-gradient(120deg,transparent,rgba(255,215,0,0.12),transparent)]" />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-5 text-center">
        <div>
          <div className="text-[16px] font-extrabold text-[#ffdf9c] drop-shadow-[0_0_12px_rgba(255,215,0,0.35)]">
            {t("title")}
          </div>
          <div className="text-[13px] text-white/60">
            {t("subtitle")}
          </div>
        </div>

        <button className="relative overflow-hidden rounded-full px-6 py-2.5 font-black text-white bg-linear-to-br from-[#c1121f] to-[#ffb703] shadow-[0_0_20px_rgba(255,60,60,0.55)] transition hover:-translate-y-[2px] hover:scale-[1.07] hover:shadow-[0_0_36px_rgba(255,80,80,0.85)]">
          {t("cta")}
          <span className="absolute inset-0 animate-shine bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent)]" />
        </button>
      </div>

      {/* Glow Border */}
      <div className="absolute bottom-0 h-[2px] w-full animate-glow bg-[linear-gradient(90deg,transparent,gold,#9D4EDD,gold,transparent)]" />

      {/* Tailwind Animations */}
      <style jsx>{`
        @keyframes flowMove {
          from { transform: translateX(-120%); }
          to { transform: translateX(120%); }
        }
        .animate-flow {
          animation: flowMove 6s linear infinite;
        }

        @keyframes glowSlide {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .animate-glow {
          animation: glowSlide 4s linear infinite;
        }

        @keyframes shineMove {
          to { transform: translateX(120%); }
        }
        .animate-shine {
          transform: translateX(-120%);
          animation: shineMove 3s infinite;
        }

        @keyframes lanternSwing {
          0% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
          100% { transform: rotate(-3deg); }
        }
      `}</style>
    </div>
  );
}

/* Lantern Component */
function Lantern({ className, delay }: { className: string; delay: string }) {
  return (
    <div
      className={`absolute w-[44px] h-[64px] rounded-[50%_50%_45%_45%] shadow-[0_0_22px_rgba(255,80,80,0.6)] bg-[radial-gradient(circle_at_30%_25%,#ffb703,#c1121f)] ${className}`}
      style={{ animation: "lanternSwing 3.5s ease-in-out infinite", animationDelay: delay }}
    >
      <div className="absolute top-[-12px] left-1/2 w-[2px] h-[16px] bg-yellow-400 -translate-x-1/2" />
      <div className="absolute bottom-[-10px] left-1/2 w-[10px] h-[10px] bg-yellow-400 rounded-full -translate-x-1/2 shadow-[0_6px_14px_rgba(255,215,0,0.7)]" />
    </div>
  );
}
