
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Download } from 'lucide-react';
import { apiService, SalesPerformanceData } from '@/services/api';
import { format } from 'date-fns';

interface SalesChartProps {
  startDate?: Date;
  endDate?: Date;
}

export const SalesChart: React.FC<SalesChartProps> = ({ startDate, endDate }) => {
  const [data, setData] = useState<SalesPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await apiService.getSalesPerformance(
        startDate?.toISOString(),
        endDate?.toISOString()
      );
      setData(result.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sales data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleExport = async () => {
    try {
      await apiService.exportSalesPerformance(
        startDate?.toISOString(),
        endDate?.toISOString()
      );
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const chartData = data.map(item => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    totalSales: item.totalSales,
    ordersCount: item.ordersCount
  }));

  const chartConfig = {
    totalSales: {
      label: "Total Sales",
      color: "hsl(var(--chart-1))",
    },
    ordersCount: {
      label: "Orders Count",
      color: "hsl(var(--chart-2))",
    },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Performance</CardTitle>
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
          <CardTitle>Sales Performance</CardTitle>
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sales Performance</CardTitle>
        <Button onClick={handleExport} size="sm" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="totalSales" fill="var(--color-totalSales)" />
              <Bar dataKey="ordersCount" fill="var(--color-ordersCount)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
