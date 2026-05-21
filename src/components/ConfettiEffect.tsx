import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
  alphaSpeed: number;
}

const PARTICLE_COLORS = [
  '#0ea5e9', // Biome Ocean
  '#22c55e', // Biome Forest
  '#67e8f9', // Biome Arctic
  '#f59e0b', // Biome Desert
  '#f472b6', // Biome Coral
];

export default function ConfettiEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState(false);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const triggerConfetti = () => {
      setActive(true);
      const newParticles: Particle[] = [];
      const count = 80;
      const width = window.innerWidth;
      const height = window.innerHeight;

      for (let i = 0; i < count; i++) {
        // Spawn from center-bottom, spraying upwards as glowing elements
        newParticles.push({
          x: width / 2,
          y: height + 20,
          vx: (Math.random() - 0.5) * 12,
          vy: -Math.random() * 18 - 8,
          color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          size: Math.random() * 6 + 4,
          opacity: 1,
          alphaSpeed: Math.random() * 0.01 + 0.005,
        });
      }

      particlesRef.current = newParticles;
    };

    const handleGameUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { type } = customEvent.detail;
      if (type === 'levelup' || type === 'achievement') {
        triggerConfetti();
      }
    };

    window.addEventListener('game_update', handleGameUpdate);
    window.addEventListener('trigger_manual_confetti', triggerConfetti);
    return () => {
      window.removeEventListener('game_update', handleGameUpdate);
      window.removeEventListener('trigger_manual_confetti', triggerConfetti);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const update = () => {
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity (lighter than traditional confetti)
        p.vx *= 0.98; // drag
        p.opacity -= p.alphaSpeed;

        if (p.y > height + 20 || p.opacity <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        // Draw glowing particles
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.restore();
      }

      if (particles.length === 0) {
        setActive(false);
      } else {
        animationId = requestAnimationFrame(update);
      }
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    />
  );
}
