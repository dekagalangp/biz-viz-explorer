
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { CustomerGrowthChart } from '@/components/dashboard/CustomerGrowthChart';
import { ProductAnalyticsChart } from '@/components/dashboard/ProductAnalyticsChart';
import { OperationalChart } from '@/components/dashboard/OperationalChart';

const Dashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const handleClearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Business Intelligence Dashboard</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Date Range Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClear={handleClearDates}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DashboardOverview />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <SalesChart startDate={startDate} endDate={endDate} />
            </div>
            <div className="col-span-3">
              <CustomerGrowthChart startDate={startDate} endDate={endDate} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <SalesChart startDate={startDate} endDate={endDate} />
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <CustomerGrowthChart startDate={startDate} endDate={endDate} />
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <ProductAnalyticsChart startDate={startDate} endDate={endDate} />
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <OperationalChart startDate={startDate} endDate={endDate} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
