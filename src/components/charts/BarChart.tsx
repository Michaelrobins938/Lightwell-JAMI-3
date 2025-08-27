import React from 'react';

interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  title?: string;
  color?: string;
}

export default function BarChart({ data, title, color = '#3B82F6' }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      {title && (
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
      )}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-xs text-gray-600 dark:text-gray-400 truncate">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-300"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color
                }}
              />
            </div>
            <div className="w-12 text-xs text-gray-900 dark:text-white text-right">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
