-- Fix RLS policies for order_items table to allow proper insertions
-- Allow buyers to insert order items when creating orders (needed for order creation)
CREATE POLICY "Buyers can insert order items for their orders"
ON public.order_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.buyer_id = auth.uid()
  )
);

-- Allow updates to order items for order management (needed for status updates)
CREATE POLICY "Order owners can update order items"
ON public.order_items
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.buyer_id = auth.uid()
  )
);

-- Allow sellers to update order items for their products (for fulfillment)
CREATE POLICY "Sellers can update order items for their products"
ON public.order_items
FOR UPDATE
USING (auth.uid() = seller_id);