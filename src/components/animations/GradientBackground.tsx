"use client";
import { useEffect, useRef } from "react";
import "./GradientBackground.scss";

const GradientBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const time = Date.now() * 0.001;
      
      // Create animated gradient
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5 + Math.sin(time * 0.5) * 100,
        canvas.height * 0.5 + Math.cos(time * 0.3) * 100,
        0,
        canvas.width * 0.5 + Math.sin(time * 0.5) * 100,
        canvas.height * 0.5 + Math.cos(time * 0.3) * 100,
        canvas.width * 0.8
      );
      
      gradient.addColorStop(0, `rgba(59, 130, 246, ${0.1 + Math.sin(time) * 0.05})`);
      gradient.addColorStop(0.5, `rgba(139, 92, 246, ${0.08 + Math.cos(time * 0.8) * 0.03})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="gradient-background">
      <canvas ref={canvasRef} className="gradient-canvas" />
      <div className="gradient-overlay" />
    </div>
  );
};

export default GradientBackground;



