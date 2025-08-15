import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProductType {
  id: string;
  title: string;
  description: string | null;
  price: number;
  min_order: number;
  unit: string;
  category: string;
  image_url: string | null;
  images: string[];
  location: string | null;
  stock_quantity: number;
  featured: boolean;
  status: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  seller_name?: string;
  seller_company?: string;
  seller_verified?: boolean;
}

export interface CategoryType {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

export const useProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    products,
    categories,
    loading,
    refetchProducts: fetchProducts,
    refetchCategories: fetchCategories
  };
};

export const useMyProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMyProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching my products:', error);
      toast({
        title: "Error",
        description: "Failed to load your products",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchMyProducts();
    setLoading(false);
  }, []);

  return {
    products,
    loading,
    refetchProducts: fetchMyProducts
  };
};