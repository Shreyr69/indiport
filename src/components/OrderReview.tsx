import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Truck, CreditCard, Package, CheckCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { loadRazorpayScript, RAZORPAY_CONFIG } from '@/lib/razorpay';
import { supabase } from '@/integrations/supabase/client';

interface OrderReviewProps {
  shippingAddress: any;
  billingAddress: any;
  deliveryMethod: any;
  paymentMethod: string;
  paymentDetails: any;
  specialInstructions: string;
  onPlaceOrder: () => void;
  onBack: () => void;
  loading: boolean;
}

export const OrderReview = ({
  shippingAddress,
  billingAddress,
  deliveryMethod,
  paymentMethod,
  paymentDetails,
  specialInstructions,
  onPlaceOrder,
  onBack,
  loading: externalLoading,
}: OrderReviewProps) => {
  const { cartItems, subtotal } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const shippingCost = subtotal >= 999 && deliveryMethod.base_cost <= 50 ? 0 : deliveryMethod.base_cost;
  const taxAmount = subtotal * 0.18; // 18% GST
  const total = subtotal + shippingCost + taxAmount;

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to place an order",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order first
      const orderRef = `ORDER_${Date.now()}`;
      const { data: razorpayOrderData, error: razorpayError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: {
            amount: total,
            currency: 'INR',
            orderId: orderRef
          }
        }
      );

      if (razorpayError || !razorpayOrderData?.orderId) {
        throw new Error('Failed to create payment order');
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Configure Razorpay options
      const options = {
        key: RAZORPAY_CONFIG.key_id,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        name: 'Your Marketplace',
        description: 'Purchase Order',
        order_id: razorpayOrderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const { error: verifyError } = await supabase.functions.invoke(
              'verify-razorpay-payment',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: orderRef
                }
              }
            );

            if (verifyError) {
              throw new Error('Payment verification failed');
            }

            // Create order in database
            await onPlaceOrder();
            setLoading(false);
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Failed",
              description: "Payment verification failed. Please contact support.",
              variant: "destructive"
            });
            setLoading(false);
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
          contact: shippingAddress?.phone || ''
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast({
              title: "Payment Cancelled",
              description: "Payment was cancelled by user",
              variant: "destructive"
            });
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Order placement error:', error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod) {
      case 'card':
        return `Credit/Debit Card ending in ${paymentDetails.cardNumber?.slice(-4)}`;
      case 'upi':
        return `UPI - ${paymentDetails.upiId}`;
      case 'netbanking':
        return `Net Banking - ${paymentDetails.selectedBank}`;
      case 'wallet':
        return 'Digital Wallet';
      default:
        return paymentMethod;
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items ({cartItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  {item.products.image_url ? (
                    <img
                      src={item.products.image_url}
                      alt={item.products.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.products.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Seller: Unknown Seller
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity} x ₹{item.products.price}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    ₹{(item.quantity * item.products.price).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="font-medium">{shippingAddress.full_name}</div>
              <div>{shippingAddress.address_line_1}</div>
              {shippingAddress.address_line_2 && <div>{shippingAddress.address_line_2}</div>}
              <div>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}</div>
              <div>Phone: {shippingAddress.phone}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Billing Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="font-medium">{billingAddress.full_name}</div>
              <div>{billingAddress.address_line_1}</div>
              {billingAddress.address_line_2 && <div>{billingAddress.address_line_2}</div>}
              <div>{billingAddress.city}, {billingAddress.state} {billingAddress.postal_code}</div>
              <div>Phone: {billingAddress.phone}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery & Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Delivery Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="font-medium">{deliveryMethod.name}</div>
              <div className="text-sm text-muted-foreground">{deliveryMethod.description}</div>
              <div className="text-sm">
                <strong>Estimated delivery:</strong> {deliveryMethod.estimated_days} business days
              </div>
              <div className="text-sm">
                <strong>Cost:</strong> {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
              </div>
              {specialInstructions && (
                <div className="text-sm">
                  <strong>Special instructions:</strong> {specialInstructions}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="font-medium">{getPaymentMethodDisplay()}</div>
              <Badge variant="secondary" className="w-fit">
                <CheckCircle className="h-3 w-3 mr-1" />
                Secure Payment
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping ({deliveryMethod.name})</span>
              <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (GST 18%)</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            {shippingCost === 0 && deliveryMethod.base_cost > 0 && (
              <div className="text-sm text-green-600">
                You saved ₹{deliveryMethod.base_cost} on shipping!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked === true)}
            />
            <label htmlFor="terms" className="text-sm cursor-pointer">
              I agree to the{' '}
              <a href="#" className="text-primary hover:underline">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
              . I understand that this order is final and I have reviewed all details.
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={loading || externalLoading}>
          Back to Payment
        </Button>
        <Button 
          onClick={handlePlaceOrder} 
          disabled={!acceptTerms || loading || externalLoading}
          className="min-w-[150px]"
        >
          {loading || externalLoading ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
};