
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { apiService, CustomerGrowthData } from '@/services/api';
import { format } from 'date-fns';

interface CustomerGrowthChartProps {
  startDate?: Date;
  endDate?: Date;
}

export const CustomerGrowthChart: React.FC<CustomerGrowthChartProps> = ({ startDate, endDate }) => {
  const [data, setData] = useState<CustomerGrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await apiService.getCustomerGrowth(
        startDate?.toISOString(),
        endDate?.toISOString(),
        'day'
      );
      setData(result.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch customer growth data');
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
    newCustomers: item.y,
    cumulative: item.cumulative
  }));

  const chartConfig = {
    newCustomers: {
      label: "New Customers",
      color: "hsl(var(--chart-1))",
    },
    cumulative: {
      label: "Cumulative",
      color: "hsl(var(--chart-2))",
    },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Growth</CardTitle>
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
          <CardTitle>Customer Growth</CardTitle>
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
        <CardTitle>Customer Growth</CardTitle>
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
                dataKey="newCustomers" 
                stroke="var(--color-newCustomers)" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="var(--color-cumulative)" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
