import React from 'react';

interface RadarChartProps {
  data: Array<{ label: string; value: number }>;
  title?: string;
  color?: string;
}

export default function RadarChart({ data, title, color = '#3B82F6' }: RadarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const centerX = 100;
  const centerY = 100;
  const radius = 60;

  // Generate polygon points
  const points = data.map((item, index) => {
    const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
    const value = (item.value / maxValue) * radius;
    const x = centerX + value * Math.cos(angle);
    const y = centerY + value * Math.sin(angle);
    return `${x},${y}`;
  });

  // Generate axis lines
  const axisLines = data.map((item, index) => {
    const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y, label: item.label };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      {title && (
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
      )}
      <div className="flex justify-center">
        <svg className="w-48 h-48" viewBox="0 0 200 200">
          {/* Grid circles */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, index) => (
            <circle
              key={index}
              cx={centerX}
              cy={centerY}
              r={radius * scale}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
              className="dark:stroke-gray-600"
            />
          ))}
          
          {/* Axis lines */}
          {axisLines.map((axis, index) => (
            <React.Fragment key={index}>
              <line
                x1={centerX}
                y1={centerY}
                x2={axis.x}
                y2={axis.y}
                stroke="#E5E7EB"
                strokeWidth="1"
                className="dark:stroke-gray-600"
              />
              <text
                x={axis.x + (axis.x - centerX) * 0.1}
                y={axis.y + (axis.y - centerY) * 0.1}
                textAnchor="middle"
                className="text-xs fill-gray-500 dark:fill-gray-400"
              >
                {axis.label}
              </text>
            </React.Fragment>
          ))}
          
          {/* Data polygon */}
          <polygon
            points={points.join(' ')}
            fill={`${color}20`}
            stroke={color}
            strokeWidth="2"
            fillOpacity="0.3"
          />
          
          {/* Data points */}
          {points.map((point, index) => {
            const [x, y] = point.split(',').map(Number);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                className="transition-all duration-200 hover:r-5"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
