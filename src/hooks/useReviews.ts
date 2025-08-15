import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProductRating {
  productId: string;
  averageRating: number;
  reviewCount: number;
}

export const useProductRatings = (productIds: string[]) => {
  const [ratings, setRatings] = useState<Map<string, ProductRating>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      if (productIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("product_id, rating")
          .in("product_id", productIds);

        if (error) throw error;

        const ratingsMap = new Map<string, ProductRating>();
        
        // Group reviews by product_id and calculate averages
        const grouped = data?.reduce((acc, review) => {
          if (!acc[review.product_id]) {
            acc[review.product_id] = [];
          }
          acc[review.product_id].push(review.rating);
          return acc;
        }, {} as Record<string, number[]>) || {};

        Object.entries(grouped).forEach(([productId, ratings]) => {
          const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
          ratingsMap.set(productId, {
            productId,
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            reviewCount: ratings.length,
          });
        });

        setRatings(ratingsMap);
      } catch (error) {
        console.error("Error fetching product ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [productIds]);

  return { ratings, loading };
};

export const useProductRating = (productId: string) => {
  const { ratings, loading } = useProductRatings([productId]);
  return {
    rating: ratings.get(productId) || { productId, averageRating: 0, reviewCount: 0 },
    loading,
  };
};