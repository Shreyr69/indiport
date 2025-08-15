-- Insert delivery methods
INSERT INTO public.delivery_methods (name, description, base_cost, estimated_days, is_active) VALUES
('Standard Delivery', 'Regular delivery within 5-7 business days', 50, 7, true),
('Express Delivery', 'Faster delivery within 2-3 business days', 100, 3, true),
('Same Day Delivery', 'Delivery within the same day (metro cities only)', 200, 1, true)
ON CONFLICT DO NOTHING;