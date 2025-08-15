-- Create user addresses table
CREATE TABLE public.user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT CHECK (type IN ('shipping', 'billing')) NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for user addresses
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- Create policies for user addresses
CREATE POLICY "Users can manage their own addresses" 
ON public.user_addresses 
FOR ALL 
USING (auth.uid() = user_id);

-- Create delivery methods table
CREATE TABLE public.delivery_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_cost DECIMAL(10,2) NOT NULL,
  estimated_days INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for delivery methods (read-only for users)
ALTER TABLE public.delivery_methods ENABLE ROW LEVEL SECURITY;

-- Create policies for delivery methods
CREATE POLICY "Anyone can view delivery methods" 
ON public.delivery_methods 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage delivery methods" 
ON public.delivery_methods 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin');

-- Insert default delivery methods
INSERT INTO public.delivery_methods (name, description, base_cost, estimated_days) VALUES
('Standard Delivery', 'Delivery within 5-7 business days', 50.00, 7),
('Express Delivery', 'Delivery within 2-3 business days', 150.00, 3),
('Same Day Delivery', 'Delivery within 24 hours (select cities only)', 300.00, 1);

-- Enhance orders table with new columns
ALTER TABLE public.orders ADD COLUMN delivery_method_id UUID REFERENCES public.delivery_methods(id);
ALTER TABLE public.orders ADD COLUMN shipping_address_id UUID REFERENCES public.user_addresses(id);
ALTER TABLE public.orders ADD COLUMN billing_address_id UUID REFERENCES public.user_addresses(id);
ALTER TABLE public.orders ADD COLUMN payment_method TEXT;
ALTER TABLE public.orders ADD COLUMN razorpay_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN razorpay_payment_id TEXT;
ALTER TABLE public.orders ADD COLUMN special_instructions TEXT;
ALTER TABLE public.orders ADD COLUMN tracking_number TEXT;

-- Create trigger for user_addresses updated_at
CREATE TRIGGER update_user_addresses_updated_at
BEFORE UPDATE ON public.user_addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create coupons table for discount system
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Create policies for coupons
CREATE POLICY "Anyone can view active coupons" 
ON public.coupons 
FOR SELECT 
USING (is_active = true AND valid_from <= now() AND valid_until >= now());

CREATE POLICY "Admins can manage coupons" 
ON public.coupons 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin');

-- Add coupon tracking to orders
ALTER TABLE public.orders ADD COLUMN coupon_id UUID REFERENCES public.coupons(id);
ALTER TABLE public.orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;