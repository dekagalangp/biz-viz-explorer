
const API_BASE_URL = 'http://localhost:4000';

export interface SalesPerformanceData {
  _id: { year: number; month: number };
  totalSales: number;
  ordersCount: number;
}

export interface CustomerGrowthData {
  x: Date;
  y: number;
  cumulative: number;
}

export interface ProductAnalyticsData {
  productId: string;
  totalRevenue: number;
  totalUnits: number;
  avgPrice: number;
}

export interface OperationalData {
  x: Date;
  totalRequests: number;
  avgLatency: number;
  errorCount: number;
}

export interface RevenueBreakdownData {
  key: string;
  revenue: number;
}

export interface UserActivityData {
  x: Date | string;
  userId: string;
  count: number;
}

class ApiService {
  private async fetchData<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  async getSalesPerformance(startDate?: string, endDate?: string) {
    return this.fetchData<{ data: SalesPerformanceData[] }>('/api/sales/performance', {
      startDate: startDate || '',
      endDate: endDate || ''
    });
  }

  async exportSalesPerformance(startDate?: string, endDate?: string) {
    const url = new URL(`${API_BASE_URL}/api/sales/performance/export`);
    if (startDate) url.searchParams.append('startDate', startDate);
    if (endDate) url.searchParams.append('endDate', endDate);
    
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Export failed');
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'sales_performance.csv';
    link.click();
    window.URL.revokeObjectURL(downloadUrl);
  }

  async getCustomerGrowth(startDate?: string, endDate?: string, interval: 'day' | 'month' = 'day') {
    return this.fetchData<{ data: CustomerGrowthData[] }>('/api/customers/growth', {
      startDate: startDate || '',
      endDate: endDate || '',
      interval
    });
  }

  async getProductAnalytics(startDate?: string, endDate?: string, limit = '10') {
    return this.fetchData<{ data: ProductAnalyticsData[] }>('/api/products/analytics', {
      startDate: startDate || '',
      endDate: endDate || '',
      limit
    });
  }

  async getOperationalOverview(startDate?: string, endDate?: string, interval: 'day' | 'hour' = 'day') {
    return this.fetchData<{ data: OperationalData[] }>('/api/operational/overview', {
      startDate: startDate || '',
      endDate: endDate || '',
      interval
    });
  }

  async getRevenueBreakdown(startDate?: string, endDate?: string, groupBy = 'category', limit = '10') {
    return this.fetchData<{ data: RevenueBreakdownData[] }>('/api/revenue/breakdown', {
      startDate: startDate || '',
      endDate: endDate || '',
      groupBy,
      limit
    });
  }

  async getUserActivity(startDate?: string, endDate?: string, groupBy: 'day' | 'user' = 'day', limit = '10') {
    return this.fetchData<{ data: UserActivityData[] }>('/api/user/activity', {
      startDate: startDate || '',
      endDate: endDate || '',
      groupBy,
      limit
    });
  }
}

export const apiService = new ApiService();
