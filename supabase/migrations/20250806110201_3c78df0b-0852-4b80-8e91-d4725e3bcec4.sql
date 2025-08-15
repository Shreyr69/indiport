-- Create reviews table for product ratings and reviews
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, buyer_id)
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Anyone can view reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Buyers can create reviews for products they can access" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can delete their own reviews" 
ON public.reviews 
FOR DELETE 
USING (auth.uid() = buyer_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get average rating for a product
CREATE OR REPLACE FUNCTION public.get_product_average_rating(product_uuid UUID)
RETURNS TABLE(avg_rating NUMERIC, review_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(rating::NUMERIC), 1) as avg_rating,
    COUNT(*) as review_count
  FROM public.reviews 
  WHERE product_id = product_uuid;
END;
$$ LANGUAGE plpgsql;