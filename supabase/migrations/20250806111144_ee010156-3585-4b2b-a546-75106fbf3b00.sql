-- Add foreign key constraints to reviews table
ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_buyer_id_fkey 
FOREIGN KEY (buyer_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;