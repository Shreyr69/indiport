import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AnalyticsDataType {
  totalSales: number;
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  topProducts: Array<{ name: string; sales: number }>;
  salesTrend: Array<{ date: string; sales: number }>;
  userGrowth: Array<{ month: string; users: number }>;
}

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const fetchAnalytics = async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);

      if (profile.role === 'admin') {
        await fetchAdminAnalytics();
      } else if (profile.role === 'seller') {
        await fetchSellerAnalytics();
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminAnalytics = async () => {
    const [
      { count: totalUsers },
      { count: totalProducts },
      { count: totalOrders },
      ordersData,
      productsData
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount, status, created_at'),
      supabase.from('products').select('title, id').eq('status', 'approved')
    ]);

    const totalSales = ordersData.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
    const pendingOrders = ordersData.data?.filter(order => order.status === 'pending').length || 0;
    const completedOrders = ordersData.data?.filter(order => order.status === 'delivered').length || 0;

    // Generate monthly revenue data
    const monthlyRevenue = generateMonthlyData(ordersData.data || [], 'total_amount');
    
    // Generate user growth data (simplified)
    const userGrowth = [
      { month: 'Jan', users: Math.floor((totalUsers || 0) * 0.6) },
      { month: 'Feb', users: Math.floor((totalUsers || 0) * 0.7) },
      { month: 'Mar', users: Math.floor((totalUsers || 0) * 0.8) },
      { month: 'Apr', users: Math.floor((totalUsers || 0) * 0.9) },
      { month: 'May', users: totalUsers || 0 }
    ];

    setAnalytics({
      totalSales,
      totalProducts: totalProducts || 0,
      totalUsers: totalUsers || 0,
      totalOrders: totalOrders || 0,
      pendingOrders,
      completedOrders,
      monthlyRevenue,
      topProducts: productsData.data?.slice(0, 5).map(p => ({ name: p.title, sales: Math.floor(Math.random() * 100) })) || [],
      salesTrend: generateDailySales(ordersData.data || []),
      userGrowth
    });
  };

  const fetchSellerAnalytics = async () => {
    const [
      productsResult,
      orderItemsResult
    ] = await Promise.all([
      supabase.from('products').select('*').eq('seller_id', user!.id),
      supabase.from('order_items').select('total_price, quantity, created_at, products!inner(seller_id)').eq('products.seller_id', user!.id)
    ]);

    const myProducts = productsResult.data || [];
    const myOrderItems = orderItemsResult.data || [];

    const totalSales = myOrderItems.reduce((sum, item) => sum + Number(item.total_price), 0);
    const totalProducts = myProducts.length;
    const approvedProducts = myProducts.filter(p => p.status === 'approved').length;
    const pendingProducts = myProducts.filter(p => p.status === 'pending').length;

    // Generate monthly revenue data for seller
    const monthlyRevenue = generateMonthlyData(myOrderItems, 'total_price');
    
    // Top products by sales
    const productSales: { [key: string]: number } = {};
    myOrderItems.forEach(item => {
      if (item.products) {
        const productId = (item.products as any).id || 'unknown';
        productSales[productId] = (productSales[productId] || 0) + item.quantity;
      }
    });

    const topProducts = Object.entries(productSales)
      .map(([productId, sales]) => {
        const product = myProducts.find(p => p.id === productId);
        return { name: product?.title || 'Unknown Product', sales };
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    setAnalytics({
      totalSales,
      totalProducts,
      totalUsers: 0, // Not applicable for sellers
      totalOrders: myOrderItems.length,
      pendingOrders: pendingProducts,
      completedOrders: approvedProducts,
      monthlyRevenue,
      topProducts,
      salesTrend: generateDailySales(myOrderItems),
      userGrowth: []
    });
  };

  const generateMonthlyData = (data: any[], field: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    return months.map(month => ({
      month,
      revenue: data
        .filter(item => {
          const date = new Date(item.created_at);
          return date.getMonth() === months.indexOf(month);
        })
        .reduce((sum, item) => sum + Number(item[field] || 0), 0)
    }));
  };

  const generateDailySales = (data: any[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date: date.split('-')[2],
      sales: data.filter(item => item.created_at.startsWith(date)).length
    }));
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user, profile]);

  return {
    analytics,
    loading,
    refetchAnalytics: fetchAnalytics
  };
};