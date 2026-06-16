'use client';

import React, { useState } from 'react';

interface DataPoint {
  timestamp: string;
  value: number;
}

interface MetricChartProps {
  data: DataPoint[];
  title: string;
  unit?: string;
  colorType?: 'indigo' | 'emerald' | 'rose' | 'amber';
  height?: number;
}

export const MetricChart: React.FC<MetricChartProps> = ({
  data,
  title,
  unit = '%',
  colorType = 'indigo',
  height = 160,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div 
        style={{ height }} 
        className="w-full flex items-center justify-center border border-zinc-200 dark:border-zinc-805 bg-zinc-50 dark:bg-zinc-950/20 rounded-lg text-xs text-zinc-400"
      >
        No metrics data available
      </div>
    );
  }

  const width = 500;
  const paddingLeft = 35;
  const paddingRight = 10;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = 100;
  const minVal = 0;

  // Map data to SVG points
  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.value - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, timestamp: d.timestamp, value: d.value };
  });

  // Generate SVG path string for line
  const linePath = points.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, '');

  // Generate SVG path string for area fill
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  // Theme styling definitions
  const themes = {
    indigo: {
      stroke: '#4f46e5',
      fillGrad: 'url(#indigo-grad)',
      dotFill: '#6366f1',
    },
    emerald: {
      stroke: '#059669',
      fillGrad: 'url(#emerald-grad)',
      dotFill: '#10b981',
    },
    rose: {
      stroke: '#e11d48',
      fillGrad: 'url(#rose-grad)',
      dotFill: '#f43f5e',
    },
    amber: {
      stroke: '#d97706',
      fillGrad: 'url(#amber-grad)',
      dotFill: '#f59e0b',
    },
  };

  const activeTheme = themes[colorType];

  // Grid line percentages
  const gridLevels = [0, 25, 50, 75, 100];

  return (
    <div className="w-full bg-white dark:bg-zinc-900/40 p-4 border border-zinc-200 dark:border-zinc-800/80 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {title}
        </h4>
        {hoveredIndex !== null ? (
          <div className="text-xs font-mono">
            <span className="text-zinc-400 dark:text-zinc-500 mr-1.5">
              {points[hoveredIndex].timestamp}:
            </span>
            <span className="font-bold text-zinc-900 dark:text-zinc-200">
              {points[hoveredIndex].value}{unit}
            </span>
          </div>
        ) : (
          <div className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
            Avg: {Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length)}{unit}
          </div>
        )}
      </div>

      <div className="relative">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto overflow-visible"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="indigo-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="emerald-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="rose-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e11d48" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="amber-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLevels.map((lvl) => {
            const y = paddingTop + chartHeight - (lvl / 100) * chartHeight;
            return (
              <g key={lvl} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="3,3"
                  className="text-zinc-200 dark:text-zinc-800"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="8"
                  className="fill-zinc-400 dark:fill-zinc-650 font-mono"
                >
                  {lvl}
                </text>
              </g>
            );
          })}

          {/* Area Path */}
          {areaPath && (
            <path
              d={areaPath}
              fill={activeTheme.fillGrad}
              className="transition-all duration-300"
            />
          )}

          {/* Line Path */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke={activeTheme.stroke}
              strokeWidth="2"
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          )}

          {/* X Axis labels (Show first, middle, last) */}
          {points.length > 0 && (
            <g className="opacity-60">
              <text
                x={points[0].x}
                y={height - 6}
                textAnchor="start"
                fontSize="8"
                className="fill-zinc-400 dark:fill-zinc-500 font-mono"
              >
                {points[0].timestamp}
              </text>
              <text
                x={points[Math.floor(points.length / 2)].x}
                y={height - 6}
                textAnchor="middle"
                fontSize="8"
                className="fill-zinc-400 dark:fill-zinc-500 font-mono"
              >
                {points[Math.floor(points.length / 2)].timestamp}
              </text>
              <text
                x={points[points.length - 1].x}
                y={height - 6}
                textAnchor="end"
                fontSize="8"
                className="fill-zinc-400 dark:fill-zinc-500 font-mono"
              >
                {points[points.length - 1].timestamp}
              </text>
            </g>
          )}

          {/* Interactivity Markers */}
          {points.map((p, i) => (
            <g key={i}>
              {/* Invisible touch target line */}
              <line
                x1={p.x}
                y1={paddingTop}
                x2={p.x}
                y2={paddingTop + chartHeight}
                stroke="transparent"
                strokeWidth={(width - paddingLeft) / data.length}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              />

              {/* Hover highlight dot */}
              {hoveredIndex === i && (
                <g>
                  <line
                    x1={p.x}
                    y1={paddingTop}
                    x2={p.x}
                    y2={paddingTop + chartHeight}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    className="text-zinc-400 dark:text-zinc-500 pointer-events-none"
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill={activeTheme.dotFill}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="shadow pointer-events-none"
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="8"
                    fill={activeTheme.dotFill}
                    fillOpacity="0.2"
                    className="animate-ping pointer-events-none"
                  />
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
