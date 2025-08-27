import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

const NightSkyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateStars();
    };

    // Generate stars
    const generateStars = () => {
      const stars: Star[] = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 8000); // Sparse distribution

      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5, // 0.5-2px
          opacity: Math.random() * 0.8 + 0.2, // 0.2-1.0
          twinkleSpeed: Math.random() * 0.02 + 0.005 // Slow twinkle
        });
      }
      starsRef.current = stars;
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const time = Date.now() * 0.001;
      
      starsRef.current.forEach(star => {
        // Gentle twinkling effect
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.3 + 0.7;
        const alpha = star.opacity * twinkle;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
        
        // Subtle glow for larger stars
        if (star.size > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.1})`;
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClient]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep night sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950" />
      
      {/* Subtle nebula clouds */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
        }}
      />
      
      {/* Aurora gradient sweep */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          x: ['-100%', '100%'],
          opacity: [0, 0.3, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), transparent)',
          filter: 'blur(40px)'
        }}
      />
      
      {/* Constellation lines */}
      {isClient && (
        <svg className="absolute inset-0 w-full h-full opacity-20" style={{ mixBlendMode: 'screen' }}>
          <motion.line
            x1="15%" y1="20%" x2="25%" y2="35%"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.4, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.line
            x1="70%" y1="15%" x2="80%" y2="30%"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.3, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
          <motion.line
            x1="40%" y1="70%" x2="55%" y2="80%"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.25, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          />
        </svg>
      )}
      
      {/* Animated stars canvas */}
      {isClient && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: 'screen' }}
        />
      )}
      
      {/* Meteor streaks - multiple shooting stars */}
      {isClient && (
        <>
          <motion.div
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ opacity: 0, x: -100, y: 100, scale: 0 }}
            animate={{
              x: [0, 1200],
              y: [0, 200],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatDelay: 15,
              ease: "easeOut"
            }}
            style={{
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.9), 0 0 16px rgba(255, 255, 255, 0.5)'
            }}
          />
          
          {/* Second meteor with different timing */}
          <motion.div
            className="absolute w-0.5 h-0.5 bg-blue-200 rounded-full"
            initial={{ opacity: 0, x: -80, y: 150, scale: 0 }}
            animate={{
              x: [0, 800],
              y: [0, 120],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatDelay: 22,
              ease: "easeOut",
              delay: 7
            }}
            style={{
              boxShadow: '0 0 6px rgba(147, 197, 253, 0.7), 0 0 12px rgba(147, 197, 253, 0.3)'
            }}
          />
          
          {/* Third meteor - rare, longer trail */}
          <motion.div
            className="absolute w-2 h-0.5 bg-gradient-to-r from-white to-transparent rounded-full"
            initial={{ opacity: 0, x: -150, y: 80, scale: 0, rotate: 45 }}
            animate={{
              x: [0, 1400],
              y: [0, 300],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatDelay: 35,
              ease: "easeOut",
              delay: 18
            }}
            style={{
              boxShadow: '0 0 12px rgba(255, 255, 255, 0.8), 0 0 24px rgba(255, 255, 255, 0.4)'
            }}
          />
        </>
      )}
      
      {/* Parallax moon */}
      <motion.div
        className="absolute top-20 right-20 w-16 h-16 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(200, 200, 220, 0.4) 100%)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
        }}
        animate={{
          y: [-5, 5, -5],
          opacity: [0.25, 0.35, 0.25]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default NightSkyBackground;