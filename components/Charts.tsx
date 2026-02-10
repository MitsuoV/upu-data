import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { ApplicantStats } from '../types';

interface DistributionChartProps {
  stats: ApplicantStats;
}

export const SPMChart: React.FC<DistributionChartProps> = ({ stats }) => {
  const data = [
    { name: 'Average A+', count: stats.avg_spm_A_plus },
    { name: 'Average A', count: stats.avg_spm_A },
  ];

  return (
    <div className="h-64 w-full">
      <h4 className="text-sm font-semibold text-gray-500 mb-2 text-center">Avg. SPM A+ vs A Count</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            cursor={{ fill: '#f1f5f9' }}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={48} name="Average Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MUETChart: React.FC<DistributionChartProps> = ({ stats }) => {
  const data = [
    { name: '5+', count: stats.muet_band_5_plus },
    { name: '5.0', count: stats.muet_band_5_0 },
    { name: '4.5', count: stats.muet_band_4_5 },
    { name: '4.0', count: stats.muet_band_4_0 },
    { name: '3.5', count: stats.muet_band_3_5 },
    { name: '3.0', count: stats.muet_band_3_0 },
  ];

  return (
    <div className="h-64 w-full">
      <h4 className="text-sm font-semibold text-gray-500 mb-2 text-center">MUET Band Distribution</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" width={40} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
             cursor={{ fill: '#f1f5f9' }}
          />
          <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};