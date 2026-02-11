"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

export default function HorseYearTopBar() {
  const t = useTranslations("horseYearTopBar");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

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
    <div className="relative min-h-[72px] sm:h-[78px] overflow-hidden border-b border-yellow-500/20 bg-slate-950 flex items-center justify-center text-white font-[Inter,system-ui] px-2 py-3 sm:py-0 sm:px-0">
      {/* Lanterns - smaller and tucked on mobile to avoid overlap */}
      <Lantern className="left-1 top-1 w-8 h-10 sm:left-4 sm:top-2 sm:w-[44px] sm:h-[64px]" delay="0s" />
      <Lantern className="right-1 top-1 w-8 h-10 sm:right-4 sm:top-2 sm:w-[44px] sm:h-[64px]" delay="1.4s" />

      {/* Canvas FX */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Energy Flow */}
      <div className="absolute inset-0 opacity-60 animate-flow bg-[linear-gradient(120deg,transparent,rgba(255,215,0,0.12),transparent)]" />

      {/* Content - stack on mobile, row on desktop */}
      <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5 text-center w-full max-w-4xl mx-auto px-6 sm:px-4">
        <div className="min-w-0 flex-1">
          <div className="text-sm sm:text-[16px] font-extrabold text-[#ffdf9c] drop-shadow-[0_0_12px_rgba(255,215,0,0.35)] leading-tight">
            {t("title")}
          </div>
          <div className="text-xs sm:text-[13px] text-white/60 mt-0.5">
            {t("subtitle")}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowEventModal(true)}
          className="relative overflow-hidden rounded-full px-4 py-2 text-sm font-black sm:px-6 sm:py-2.5 sm:text-base w-full sm:w-auto shrink-0 max-w-[280px] sm:max-w-none mx-auto text-white bg-linear-to-br from-[#c1121f] to-[#ffb703] shadow-[0_0_20px_rgba(255,60,60,0.55)] transition hover:-translate-y-[2px] hover:scale-[1.02] sm:hover:scale-[1.07] hover:shadow-[0_0_36px_rgba(255,80,80,0.85)] active:scale-[0.98]"
        >
          {t("cta")}
          <span className="absolute inset-0 animate-shine bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent)]" />
        </button>
      </div>

      {/* Glow Border */}
      <div className="absolute bottom-0 h-[2px] w-full animate-glow bg-[linear-gradient(90deg,transparent,gold,#9D4EDD,gold,transparent)]" />

      {/* Event not started modal - common style */}
      {typeof document !== "undefined" &&
        createPortal(
          showEventModal ? (
            <div
              className="fixed inset-0 z-10000 flex items-center justify-center px-6"
              onClick={() => setShowEventModal(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="event-modal-title"
            >
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
              <div
                className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-2xl p-6 sm:p-7"
                onClick={(e) => e.stopPropagation()}
              >
                <p
                  id="event-modal-title"
                  className="text-white text-lg sm:text-xl font-semibold mb-6"
                >
                  {t("modal.eventNotStarted")}
                </p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-semibold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all duration-300 cursor-pointer"
                  >
                    {t("modal.confirm")}
                  </button>
                </div>
              </div>
            </div>
          ) : null,
          document.body
        )}

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

/* Lantern Component - size/position via className for responsive */
function Lantern({ className, delay }: { className: string; delay: string }) {
  return (
    <div
      className={`absolute rounded-[50%_50%_45%_45%] shadow-[0_0_22px_rgba(255,80,80,0.6)] bg-[radial-gradient(circle_at_30%_25%,#ffb703,#c1121f)] ${className}`}
      style={{ animation: "lanternSwing 3.5s ease-in-out infinite", animationDelay: delay }}
    >
      <div className="absolute top-[-12px] left-1/2 w-[2px] h-[16px] bg-yellow-400 -translate-x-1/2" />
      <div className="absolute bottom-[-10px] left-1/2 w-[10px] h-[10px] bg-yellow-400 rounded-full -translate-x-1/2 shadow-[0_6px_14px_rgba(255,215,0,0.7)]" />
    </div>
  );
}
