
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { apiService, OperationalData } from '@/services/api';
import { format } from 'date-fns';

interface OperationalChartProps {
  startDate?: Date;
  endDate?: Date;
}

export const OperationalChart: React.FC<OperationalChartProps> = ({ startDate, endDate }) => {
  const [data, setData] = useState<OperationalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await apiService.getOperationalOverview(
        startDate?.toISOString(),
        endDate?.toISOString(),
        'day'
      );
      setData(result.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch operational data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const chartData = data.map(item => ({
    date: format(new Date(item.x), 'MMM dd'),
    requests: item.totalRequests,
    latency: item.avgLatency,
    errors: item.errorCount
  }));

  const chartConfig = {
    requests: {
      label: "Total Requests",
      color: "hsl(var(--chart-1))",
    },
    latency: {
      label: "Avg Latency (ms)",
      color: "hsl(var(--chart-2))",
    },
    errors: {
      label: "Error Count",
      color: "hsl(var(--chart-3))",
    },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Operational Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Operational Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-destructive">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operational Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="requests" 
                stroke="var(--color-requests)" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="latency" 
                stroke="var(--color-latency)" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="errors" 
                stroke="var(--color-errors)" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
