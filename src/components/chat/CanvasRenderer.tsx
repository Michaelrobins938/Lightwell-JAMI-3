"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CanvasRendererProps {
  content: string;
  width?: number;
  height?: number;
}

export default function CanvasRenderer({ content, width = 400, height = 300 }: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Parse content for drawing instructions
    try {
      const instructions = JSON.parse(content);
      renderCanvas(ctx, instructions);
    } catch (error) {
      // If not JSON, try to render as text-based instructions
      renderTextInstructions(ctx, content);
    }
  }, [content, width, height]);

  const renderCanvas = (ctx: CanvasRenderingContext2D, instructions: any) => {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#1e40af';

    if (instructions.shapes) {
      instructions.shapes.forEach((shape: any) => {
        switch (shape.type) {
          case 'rectangle':
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
            break;
          case 'circle':
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
            ctx.fill();
            break;
          case 'line':
            ctx.beginPath();
            ctx.moveTo(shape.x1, shape.y1);
            ctx.lineTo(shape.x2, shape.y2);
            ctx.stroke();
            break;
        }
      });
    }
  };

  const renderTextInstructions = (ctx: CanvasRenderingContext2D, instructions: string) => {
    // Simple text-based canvas rendering
    ctx.fillStyle = '#3b82f6';
    ctx.font = '16px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    const lines = instructions.split('\n');
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), width / 2, 30 + (index * 25));
    });
  };

  const handleMouseDown = () => setIsDrawing(true);
  const handleMouseUp = () => setIsDrawing(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="my-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-300">Canvas Diagram</h4>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
            onClick={() => {
              const canvas = canvasRef.current;
              if (canvas) {
                const link = document.createElement('a');
                link.download = 'canvas-diagram.png';
                link.href = canvas.toDataURL();
                link.click();
              }
            }}
          >
            Download
          </button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-600 rounded-lg bg-white cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      <div className="mt-2 text-xs text-gray-400 text-center">
        Interactive canvas for diagrams and visualizations
      </div>
    </motion.div>
  );
}
