import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CartItemType } from './useCart';

export interface OrderType {
  id: string;
  order_number: string;
  buyer_id: string;
  subtotal: number;
  shipping_cost: number | null;
  tax_amount: number | null;
  total_amount: number;
  shipping_address: any;
  status: string;
  created_at: string;
  updated_at: string;
  order_items: {
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    products: {
      title: string;
      image_url: string | null;
      unit: string;
    };
  }[];
}

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              title,
              image_url,
              unit
            )
          )
        `);

      // Filter based on user role
      if (profile?.role === 'buyer') {
        query = query.eq('buyer_id', user.id);
      } else if (profile?.role === 'seller') {
        // For sellers, get orders containing their products
        query = query.eq('order_items.seller_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (
    cartItems: CartItemType[],
    shippingAddress?: any
  ) => {
    if (!user || cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Cannot create order: invalid data",
        variant: "destructive"
      });
      return null;
    }

    try {
      const subtotal = cartItems.reduce((sum, item) => 
        sum + (item.products.price * item.quantity), 0
      );
      const shippingCost = 50; // Fixed shipping for now
      const taxAmount = subtotal * 0.1; // 10% tax
      const totalAmount = subtotal + shippingCost + taxAmount;

      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          buyer_id: user.id,
          subtotal,
          shipping_cost: shippingCost,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.products.price,
        total_price: item.products.price * item.quantity,
        seller_id: item.products.seller_id
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await fetchOrders();
      toast({
        title: "Order placed",
        description: `Order ${orderNumber} has been placed successfully`
      });

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user, profile]);

  return {
    orders,
    loading,
    createOrder,
    refetchOrders: fetchOrders
  };
};