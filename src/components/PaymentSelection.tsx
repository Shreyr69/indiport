import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Smartphone, Building2, Wallet, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loadRazorpayScript, RAZORPAY_CONFIG } from '@/lib/razorpay';
import { supabase } from '@/integrations/supabase/client';

interface PaymentSelectionProps {
  total: number;
  onNext: (paymentMethod: string, paymentDetails?: any) => void;
  onBack: () => void;
}

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, Rupay',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: 'upi',
    name: 'UPI',
    description: 'PhonePe, Google Pay, Paytm',
    icon: <Smartphone className="h-5 w-5" />,
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'All major banks supported',
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    description: 'Paytm, PhonePe, Amazon Pay',
    icon: <Wallet className="h-5 w-5" />,
  },
];

const banks = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'Bank of India',
  'Indian Bank',
];

export const PaymentSelection = ({ total, onNext, onBack }: PaymentSelectionProps) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleNext = async () => {
    setLoading(true);
    
    try {
      // Validate form based on selected method
      let paymentDetails = {};

      switch (selectedMethod) {
        case 'card':
          if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
            toast({
              title: "Missing Information",
              description: "Please fill all card details",
              variant: "destructive"
            });
            return;
          }
          paymentDetails = { cardNumber, expiryDate, cvv, cardholderName };
          break;
        case 'upi':
          if (!upiId) {
            toast({
              title: "Missing Information", 
              description: "Please enter UPI ID",
              variant: "destructive"
            });
            return;
          }
          paymentDetails = { upiId };
          break;
        case 'netbanking':
          if (!selectedBank) {
            toast({
              title: "Missing Information",
              description: "Please select a bank", 
              variant: "destructive"
            });
            return;
          }
          paymentDetails = { selectedBank };
          break;
        case 'wallet':
          paymentDetails = {};
          break;
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast({
          title: "Payment Error",
          description: "Failed to load payment gateway",
          variant: "destructive"
        });
        return;
      }

      onNext(selectedMethod, paymentDetails);
    } catch (error) {
      console.error('Payment setup error:', error);
      toast({
        title: "Error",
        description: "Failed to setup payment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  maxLength={4}
                  type="password"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
              />
            </div>
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="yourname@paytm"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
            <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="text-6xl">📱</div>
              <p className="text-sm text-muted-foreground mt-2">
                QR Code will appear here for UPI payment
              </p>
            </div>
          </div>
        );

      case 'netbanking':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bank">Select Your Bank</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-center p-8 border rounded-lg bg-muted/50">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">
                You will be redirected to your bank's secure website
              </p>
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {['Paytm', 'PhonePe', 'Amazon Pay'].map((wallet) => (
                <div key={wallet} className="border rounded-lg p-4 text-center hover:bg-muted/50 cursor-pointer">
                  <Wallet className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <span className="text-sm font-medium">{wallet}</span>
                </div>
              ))}
            </div>
            <div className="text-center p-6 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Select your preferred wallet and you'll be redirected to complete the payment
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Choose Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-start space-x-3">
                <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                <label htmlFor={method.id} className="flex-1 cursor-pointer">
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-primary">{method.icon}</div>
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {method.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          {renderPaymentForm()}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              All prices include applicable taxes
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
        <Shield className="h-4 w-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Delivery
        </Button>
        <Button onClick={handleNext} disabled={loading} className="min-w-[120px]">
          {loading ? "Processing..." : "Continue to Review"}
        </Button>
      </div>
    </div>
  );
};