import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { onVisitsUpdate } from '@/lib/services/rtdb';

type ChartData = {
  name: string;
  visits: number;
  fill: string;
};

const COLORS = {
  personA: '#8884d8',
  personB: '#82ca9d',
};

const VisitsBarChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const unsubscribe = onVisitsUpdate((data) => {
      setChartData([
        { name: 'Person A', visits: data.personA.visits, fill: COLORS.personA },
        { name: 'Person B', visits: data.personB.visits, fill: COLORS.personB },
      ]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Visits Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Number of Visits', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            formatter={(value) => [`${value} visits`, 'Visits']}
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderColor: 'rgba(10, 30, 60, 0.15)',
              borderRadius: '0.5rem',
              color: '#050F1A'
            }}
          />
          <Bar 
            dataKey="visits" 
            name="Visits"
            radius={[4, 4, 0, 0]}
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitsBarChart;
