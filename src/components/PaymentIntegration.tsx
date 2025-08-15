import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Lock, Smartphone, QrCode, University } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentIntegrationProps {
  orderTotal: number;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentCancel: () => void;
}

const PaymentIntegration = ({ orderTotal, onPaymentSuccess, onPaymentCancel }: PaymentIntegrationProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    upiId: '',
    selectedBank: ''
  });

  // Mock Razorpay integration
  const initiatePayment = async () => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock payment success with dummy Razorpay response
      const mockPaymentResponse = {
        razorpay_payment_id: `pay_${Date.now()}`,
        razorpay_order_id: `order_${Date.now()}`,
        razorpay_signature: `sig_${Date.now()}`,
        method: paymentMethod,
        amount: orderTotal * 100, // Amount in paisa
        status: 'captured',
        created_at: new Date().toISOString()
      };

      toast({
        title: "Payment Successful!",
        description: `Payment of ₹${orderTotal.toFixed(2)} completed successfully`,
      });

      onPaymentSuccess(mockPaymentResponse);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCardForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={paymentData.cardNumber}
          onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
          className="mt-1"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            placeholder="MM/YY"
            value={paymentData.expiryDate}
            onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="123"
            value={paymentData.cvv}
            onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="cardHolder">Cardholder Name</Label>
        <Input
          id="cardHolder"
          placeholder="John Doe"
          value={paymentData.cardHolder}
          onChange={(e) => setPaymentData(prev => ({ ...prev, cardHolder: e.target.value }))}
          className="mt-1"
        />
      </div>
    </div>
  );

  const renderUPIForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="upiId">UPI ID</Label>
        <Input
          id="upiId"
          placeholder="yourname@paytm"
          value={paymentData.upiId}
          onChange={(e) => setPaymentData(prev => ({ ...prev, upiId: e.target.value }))}
          className="mt-1"
        />
      </div>
      <div className="text-center p-6 border-2 border-dashed border-border rounded-lg">
        <QrCode className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">Scan QR code with any UPI app</p>
      </div>
    </div>
  );

  const renderNetBankingForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="bank">Select Your Bank</Label>
        <Select value={paymentData.selectedBank} onValueChange={(value) => setPaymentData(prev => ({ ...prev, selectedBank: value }))}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Choose your bank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sbi">State Bank of India</SelectItem>
            <SelectItem value="hdfc">HDFC Bank</SelectItem>
            <SelectItem value="icici">ICICI Bank</SelectItem>
            <SelectItem value="axis">Axis Bank</SelectItem>
            <SelectItem value="pnb">Punjab National Bank</SelectItem>
            <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <Card className="card-elevated max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Secure Payment
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete your order payment securely
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Order Total</span>
            <span className="text-lg font-semibold">₹{orderTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Including taxes</span>
            <span className="text-success">Secure Payment</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div>
          <Label className="text-sm font-medium">Payment Method</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => setPaymentMethod('card')}
            >
              <CreditCard className="h-5 w-5 mb-1" />
              <span className="text-xs">Card</span>
            </Button>
            <Button
              variant={paymentMethod === 'upi' ? 'default' : 'outline'}
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => setPaymentMethod('upi')}
            >
              <Smartphone className="h-5 w-5 mb-1" />
              <span className="text-xs">UPI</span>
            </Button>
            <Button
              variant={paymentMethod === 'netbanking' ? 'default' : 'outline'}
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => setPaymentMethod('netbanking')}
            >
              <University className="h-5 w-5 mb-1" />
              <span className="text-xs">Net Banking</span>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Payment Form */}
        {paymentMethod === 'card' && renderCardForm()}
        {paymentMethod === 'upi' && renderUPIForm()}
        {paymentMethod === 'netbanking' && renderNetBankingForm()}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onPaymentCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 btn-primary"
            onClick={initiatePayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay ₹${orderTotal.toFixed(2)}`}
          </Button>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Powered by Razorpay • Secure & Encrypted
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentIntegration;