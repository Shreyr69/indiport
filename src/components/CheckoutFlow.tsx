import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { CheckoutStepper } from './CheckoutStepper';
import { AddressForm } from './AddressForm';
import { DeliveryOptions } from './DeliveryOptions';
import { PaymentSelection } from './PaymentSelection';
import { OrderReview } from './OrderReview';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';

const CHECKOUT_STEPS = ['Address', 'Delivery', 'Payment', 'Review'];

export const CheckoutFlow = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Checkout data
  const [shippingAddress, setShippingAddress] = useState<any>(null);
  const [billingAddress, setBillingAddress] = useState<any>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<any>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState<any>({});

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some products to your cart before checkout</p>
              <button
                onClick={() => navigate('/products')}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                Continue Shopping
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleAddressNext = (shipping: any, billing?: any) => {
    setShippingAddress(shipping);
    setBillingAddress(billing || shipping);
    setCurrentStep(1);
  };

  const handleDeliveryNext = (method: any, instructions: string) => {
    setDeliveryMethod(method);
    setSpecialInstructions(instructions);
    setCurrentStep(2);
  };

  const handlePaymentNext = (method: string, details?: any) => {
    setPaymentMethod(method);
    setPaymentDetails(details || {});
    setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to place an order",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Calculate final amounts
      const shippingCost = subtotal >= 999 && deliveryMethod.base_cost <= 50 ? 0 : deliveryMethod.base_cost;
      const taxAmount = subtotal * 0.18;
      const totalAmount = subtotal + shippingCost + taxAmount;

      // Create order with enhanced data
      const order = await createOrder(cartItems, {
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        delivery_method: deliveryMethod,
        special_instructions: specialInstructions,
        payment_method: paymentMethod,
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
        total_amount: totalAmount,
      });

      if (!order) {
        throw new Error('Failed to create order');
      }

      // Clear cart
      await clearCart();

      toast({
        title: "Order Placed Successfully!",
        description: `Your order has been placed. Order ID: ${order.order_number}`,
      });

      // Redirect to order confirmation page
      navigate('/checkout/confirmation', { 
        state: { 
          orderId: order.order_number,
          totalAmount 
        }
      });

    } catch (error) {
      console.error('Order placement error:', error);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <AddressForm
            onNext={handleAddressNext}
            onBack={() => navigate('/cart')}
          />
        );
      case 1:
        return (
          <DeliveryOptions
            subtotal={subtotal}
            onNext={handleDeliveryNext}
            onBack={() => setCurrentStep(0)}
          />
        );
      case 2:
        const shippingCost = subtotal >= 999 && deliveryMethod?.base_cost <= 50 ? 0 : deliveryMethod?.base_cost || 0;
        const taxAmount = subtotal * 0.18;
        const total = subtotal + shippingCost + taxAmount;
        
        return (
          <PaymentSelection
            total={total}
            onNext={handlePaymentNext}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <OrderReview
            shippingAddress={shippingAddress}
            billingAddress={billingAddress}
            deliveryMethod={deliveryMethod}
            paymentMethod={paymentMethod}
            paymentDetails={paymentDetails}
            specialInstructions={specialInstructions}
            onPlaceOrder={handlePlaceOrder}
            onBack={() => setCurrentStep(2)}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <CheckoutStepper currentStep={currentStep} steps={CHECKOUT_STEPS} />
          
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};