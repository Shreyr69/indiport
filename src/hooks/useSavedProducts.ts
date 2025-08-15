import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SavedProductType {
  id: string;
  product_id: string;
  buyer_id: string;
  created_at: string;
  products: {
    id: string;
    title: string;
    price: number;
    image_url: string;
    images: string[];
    category: string;
    location: string;
    stock_quantity: number;
    min_order: number;
    unit: string;
  };
}

export const useSavedProducts = () => {
  const [savedProducts, setSavedProducts] = useState<SavedProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSavedProducts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_products')
        .select(`
          *,
          products (
            id,
            title,
            price,
            image_url,
            images,
            category,
            location,
            stock_quantity,
            min_order,
            unit
          )
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedProducts(data || []);
    } catch (error) {
      console.error('Error fetching saved products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch saved products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_products')
        .insert({
          product_id: productId,
          buyer_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Product Saved",
        description: "Product has been added to your saved list"
      });

      fetchSavedProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      });
    }
  };

  const removeSavedProduct = async (savedProductId: string) => {
    try {
      const { error } = await supabase
        .from('saved_products')
        .delete()
        .eq('id', savedProductId);

      if (error) throw error;

      toast({
        title: "Product Removed",
        description: "Product has been removed from your saved list"
      });

      fetchSavedProducts();
    } catch (error) {
      console.error('Error removing saved product:', error);
      toast({
        title: "Error",
        description: "Failed to remove saved product",
        variant: "destructive"
      });
    }
  };

  const isProductSaved = (productId: string) => {
    return savedProducts.some(sp => sp.product_id === productId);
  };

  useEffect(() => {
    fetchSavedProducts();
  }, [user]);

  return {
    savedProducts,
    loading,
    saveProduct,
    removeSavedProduct,
    isProductSaved,
    refetchSavedProducts: fetchSavedProducts
  };
};