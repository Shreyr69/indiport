import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, loading, updateCartItem, removeFromCart, clearCart, subtotal } = useCart();

  const shippingCost = subtotal > 1000 ? 0 : 50; // Free shipping over $1000
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItem(cartItemId, newQuantity);
  };

  const handleCheckout = () => {
    if (!user) return;
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/products" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="heading-primary mb-2">Shopping Cart</h1>
          <p className="text-body">Review your items and proceed to checkout</p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <Card className="card-elevated max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Add products to your cart to start your order
              </p>
              <Link to="/products">
                <Button className="btn-primary">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-6 border-b border-border last:border-b-0 last:pb-0">
                      <Link to={`/products/${item.product_id}`} className="flex-shrink-0">
                        <img
                          src={item.products.image_url || '/placeholder.svg'}
                          alt={item.products.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </Link>
                      
                      <div className="flex-1">
                        <Link 
                          to={`/products/${item.product_id}`}
                          className="font-semibold text-foreground hover:text-primary line-clamp-2"
                        >
                          {item.products.title}
                        </Link>
                        
                        <div className="flex items-center gap-4 mt-3">
                          <div className="text-lg font-bold text-primary">
                            ${item.products.price} / {item.products.unit}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                              className="w-20 text-center"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              {item.products.unit}
                            </span>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm text-muted-foreground">
                            Available in stock
                          </span>
                          <span className="font-semibold text-foreground">
                            Subtotal: ${(item.products.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="card-elevated sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping:</span>
                      <span className="font-medium">
                        {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (8%):</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    
                    {subtotal > 1000 && (
                      <div className="text-sm text-success bg-success-light p-2 rounded">
                        🎉 You qualify for free shipping!
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button onClick={handleCheckout} className="w-full btn-primary">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                    
                    <div className="text-center">
                      <Link to="/products" className="text-sm text-primary hover:underline">
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
                    <p>• Secure payment processing</p>
                    <p>• 30-day return policy</p>
                    <p>• Buyer protection guarantee</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;