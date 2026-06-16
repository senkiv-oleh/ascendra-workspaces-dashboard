'use client';

import React from 'react';
import { FleetTrendPoint } from '../../types';
import { MetricChart } from '../developer/MetricChart';

interface UtilizationChartsProps {
  trendData: FleetTrendPoint[];
}

export const UtilizationCharts: React.FC<UtilizationChartsProps> = ({ trendData }) => {
  // Map FleetTrendPoint points to MetricChart format
  const cpuPoints = trendData.map((pt) => ({
    timestamp: pt.timestamp,
    value: pt.cpu,
  }));

  const memoryPoints = trendData.map((pt) => ({
    timestamp: pt.timestamp,
    value: pt.memory,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MetricChart
        data={cpuPoints}
        title="Fleet Aggregate CPU Load"
        unit="%"
        colorType="rose"
        height={180}
      />
      <MetricChart
        data={memoryPoints}
        title="Fleet Aggregate Memory Load"
        unit="%"
        colorType="amber"
        height={180}
      />
    </div>
  );
};
