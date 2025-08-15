import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, Receipt, Home } from 'lucide-react';

export const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, totalAmount } = location.state || {};

  useEffect(() => {
    // If no order data, redirect to home
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (!orderId) {
    return null;
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <Card className="text-center mb-8">
            <CardContent className="pt-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
              <p className="text-muted-foreground mb-4">
                Thank you for your order. We'll send you updates on your delivery.
              </p>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Order ID: {orderId}
              </Badge>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount Paid</span>
                  <span className="text-2xl font-bold">₹{totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Payment Method</span>
                  <span>Razorpay (Demo - Auto Success)</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Order Date</span>
                  <span>{new Date().toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Order Confirmed</div>
                    <div className="text-sm text-muted-foreground">Your order has been placed and confirmed</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Processing</div>
                    <div className="text-sm text-muted-foreground">We're preparing your order for shipment</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Home className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Delivery</div>
                    <div className="text-sm text-muted-foreground">
                      Expected by {estimatedDelivery.toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium">Order Confirmation Email</div>
                    <div className="text-muted-foreground">You'll receive an email confirmation shortly</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium">Shipping Updates</div>
                    <div className="text-muted-foreground">We'll notify you when your order ships</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium">Track Your Order</div>
                    <div className="text-muted-foreground">You can track your order in the orders section</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/buyer-dashboard')}
              className="flex-1"
            >
              View Order Details
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};