'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BehavioralMetrics } from '@/types/personalization';

interface BehavioralTrackerProps {
  questionId: string;
  onMetricsUpdate?: (metrics: BehavioralMetrics) => void;
  children: React.ReactNode;
}

export const BehavioralTracker: React.FC<BehavioralTrackerProps> = ({
  questionId,
  onMetricsUpdate,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [startTime] = useState(Date.now());
  const [mouseMovements, setMouseMovements] = useState<Array<{x: number, y: number, timestamp: number}>>([]);
  const [scrollEvents, setScrollEvents] = useState<Array<{scrollY: number, timestamp: number}>>([]);
  const [clickEvents, setClickEvents] = useState<Array<{x: number, y: number, timestamp: number}>>([]);
  const [hesitationEvents, setHesitationEvents] = useState<number[]>([]);
  const [lastMouseMove, setLastMouseMove] = useState(Date.now());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let hesitationTimer: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const rect = container.getBoundingClientRect();
      
      setMouseMovements(prev => [...prev, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        timestamp: now
      }]);

      // Track hesitation (periods of no movement)
      const timeSinceLastMove = now - lastMouseMove;
      if (timeSinceLastMove > 2000) { // 2 seconds of no movement
        setHesitationEvents(prev => [...prev, timeSinceLastMove]);
      }
      setLastMouseMove(now);

      // Reset hesitation timer
      clearTimeout(hesitationTimer);
      hesitationTimer = setTimeout(() => {
        const hesitationTime = Date.now() - now;
        if (hesitationTime > 3000) { // 3+ seconds indicates significant hesitation
          setHesitationEvents(prev => [...prev, hesitationTime]);
        }
      }, 3000);
    };

    const handleScroll = () => {
      setScrollEvents(prev => [...prev, {
        scrollY: window.scrollY,
        timestamp: Date.now()
      }]);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setClickEvents(prev => [...prev, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        timestamp: Date.now()
      }]);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(hesitationTimer);
    };
  }, [lastMouseMove]); // Added lastMouseMove to dependency array

  const calculateBehavioralMetrics = useCallback((): BehavioralMetrics => {
    const totalTime = Date.now() - startTime;
    
    const mouseDistance = mouseMovements.length < 2 ? 0 : 
      mouseMovements.reduce((total, current, index) => {
        if (index === 0) return 0;
        const prev = mouseMovements[index - 1];
        const distance = Math.sqrt(
          Math.pow(current.x - prev.x, 2) + Math.pow(current.y - prev.y, 2)
        );
        return total + distance;
      }, 0);
    
    const scrollDistance = scrollEvents.length < 2 ? 0 :
      scrollEvents.reduce((total, current, index) => {
        if (index === 0) return 0;
        const prev = scrollEvents[index - 1];
        return total + Math.abs(current.scrollY - prev.scrollY);
      }, 0);
    
    const clickFrequency = clickEvents.length / (totalTime / 1000);

    const calculateEngagementScore = (
      totalTime: number,
      mouseDistance: number,
      scrollDistance: number,
      clickFrequency: number
    ): number => {
      // Normalize factors (simplified scoring algorithm)
      const timeScore = Math.min(totalTime / 30000, 1); // 30 seconds = max time score
      const mouseScore = Math.min(mouseDistance / 1000, 1); // 1000px = max mouse score
      const scrollScore = Math.min(scrollDistance / 500, 1); // 500px = max scroll score
      const clickScore = Math.min(clickFrequency * 10, 1); // 0.1 clicks/sec = max click score

      // Weighted average
      return (timeScore * 0.3 + mouseScore * 0.3 + scrollScore * 0.2 + clickScore * 0.2);
    };

    return {
      avgResponseTime: totalTime,
      hesitationPattern: hesitationEvents,
      engagementScore: calculateEngagementScore(totalTime, mouseDistance, scrollDistance, clickFrequency),
      completionRate: 1, // Will be updated by parent component
      mouseMovements: {
        totalDistance: mouseDistance,
        avgVelocity: mouseDistance / (totalTime / 1000),
        clickCount: clickEvents.length,
        maxIdleTime: Math.max(...hesitationEvents, 0)
      },
      scrollPatterns: {
        totalDistance: scrollDistance,
        scrollCount: scrollEvents.length,
        avgScrollVelocity: scrollDistance / (totalTime / 1000)
      },
      dropOffPoints: [] // Will be tracked by parent component
    };
  }, [startTime, clickEvents, hesitationEvents, scrollEvents, mouseMovements]);

  // Calculate metrics when component unmounts or question changes
  useEffect(() => {
    return () => {
      if (onMetricsUpdate) {
        const metrics = calculateBehavioralMetrics();
        onMetricsUpdate(metrics);
      }
    };
  }, [questionId, onMetricsUpdate, calculateBehavioralMetrics]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {children}
    </div>
  );
};

// Additional types
interface MouseMetrics {
  totalDistance: number;
  avgVelocity: number;
  clickCount: number;
  maxIdleTime: number;
}

interface ScrollMetrics {
  totalDistance: number;
  scrollCount: number;
  avgScrollVelocity: number;
} 