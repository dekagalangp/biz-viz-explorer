
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground flex items-center">
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1 text-red-600" />
            )}
            {change} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export const DashboardOverview: React.FC = () => {
  // These would typically come from your API
  const metrics = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      trend: "up" as const,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Active Users",
      value: "2,350",
      change: "+180.1%",
      trend: "up" as const,
      icon: <Users className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Sales",
      value: "12,234",
      change: "+19%",
      trend: "up" as const,
      icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Server Uptime",
      value: "99.9%",
      change: "-0.1%",
      trend: "down" as const,
      icon: <Activity className="h-4 w-4 text-muted-foreground" />
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};
