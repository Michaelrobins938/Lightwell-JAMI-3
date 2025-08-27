import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Parallax hook for creating parallax effects
export const useParallax = (speed: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -speed * 100]);

  return { ref, y };
};

// Parallax Section Component
interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  background?: string;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.5,
  className = '',
  background
}) => {
  const { ref, y } = useParallax(speed);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={`relative ${className}`}
    >
      {background && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${background})` }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// Advanced parallax with multiple layers
export const useMultiLayerParallax = (layers: number[] = [0.2, 0.5, 0.8]) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const transforms = layers.map(speed =>
    useTransform(scrollYProgress, [0, 1], [0, -speed * 100])
  );

  return { ref, transforms };
};

// Horizontal parallax effect
export const useHorizontalParallax = (speed: number = 0.3) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return { ref, x };
};

// Scale parallax effect
export const useScaleParallax = (scaleRange: [number, number] = [0.8, 1.2]) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], scaleRange);

  return { ref, scale };
};

// Opacity parallax effect
export const useOpacityParallax = (opacityRange: [number, number] = [0, 1]) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], opacityRange);

  return { ref, opacity };
};

// Rotation parallax effect
export const useRotationParallax = (rotationRange: [number, number] = [0, 360]) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], rotationRange);

  return { ref, rotate };
};

export default useParallax;