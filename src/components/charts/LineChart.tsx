import React from 'react';

interface LineChartProps {
  data: Array<{ x: string; y: number }>;
  title?: string;
  color?: string;
}

export default function LineChart({ data, title, color = '#3B82F6' }: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  const maxY = Math.max(...data.map(d => d.y));
  const minY = Math.min(...data.map(d => d.y));
  const range = maxY - minY || 1;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      {title && (
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
      )}
      <div className="relative h-48">
        <svg className="w-full h-full" viewBox={`0 0 ${data.length * 60} 200`}>
          {data.map((point, index) => {
            const x = index * 60 + 30;
            const y = 180 - ((point.y - minY) / range) * 160;
            
            return (
              <React.Fragment key={index}>
                {/* Data point */}
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={color}
                  className="transition-all duration-200 hover:r-6"
                />
                
                {/* Line to next point */}
                {index < data.length - 1 && (
                  <line
                    x1={x}
                    y1={y}
                    x2={x + 60}
                    y2={180 - ((data[index + 1].y - minY) / range) * 160}
                    stroke={color}
                    strokeWidth="2"
                    fill="none"
                  />
                )}
                
                {/* X-axis label */}
                <text
                  x={x}
                  y="195"
                  textAnchor="middle"
                  className="text-xs fill-gray-500 dark:fill-gray-400"
                >
                  {point.x}
                </text>
              </React.Fragment>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
