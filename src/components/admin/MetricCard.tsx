import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
}) => {
  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.direction === 'up') return 'text-emerald-500';
    if (trend.direction === 'down') return 'text-red-500';
    return 'text-zinc-400';
  };

  return (
    <Card className="hover:border-zinc-700/60 dark:hover:bg-zinc-900/80 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {title}
          </span>
          <div className="text-zinc-500 dark:text-zinc-450 bg-zinc-100 dark:bg-zinc-800/60 p-2 rounded-lg border border-zinc-200/20 dark:border-zinc-700/30">
            {icon}
          </div>
        </div>
        <div className="flex items-baseline space-x-2.5 mt-2">
          <span className="text-2xl font-black font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
            {value}
          </span>
          {trend && (
            <span className={`text-[10px] font-bold ${getTrendColor()}`}>
              {trend.direction === 'up' ? '▲' : trend.direction === 'down' ? '▼' : '■'} {trend.value}
            </span>
          )}
        </div>
        {description && (
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1.5 font-medium leading-none">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
