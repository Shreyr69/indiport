import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Truck, Clock, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  base_cost: number;
  estimated_days: number;
}

interface DeliveryOptionsProps {
  subtotal: number;
  onNext: (deliveryMethod: DeliveryMethod, specialInstructions: string) => void;
  onBack: () => void;
}

const getDeliveryIcon = (name: string) => {
  if (name.toLowerCase().includes('same day')) return <Zap className="h-5 w-5" />;
  if (name.toLowerCase().includes('express')) return <Clock className="h-5 w-5" />;
  return <Truck className="h-5 w-5" />;
};

export const DeliveryOptions = ({ subtotal, onNext, onBack }: DeliveryOptionsProps) => {
  const { toast } = useToast();
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDeliveryMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_methods')
        .select('*')
        .eq('is_active', true)
        .order('base_cost', { ascending: true });

      if (error) throw error;

      setDeliveryMethods(data);
      
      // Select the first method by default
      if (data.length > 0) {
        setSelectedMethod(data[0].id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch delivery options",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const selectedDeliveryMethod = deliveryMethods.find(method => method.id === selectedMethod);
    
    if (!selectedDeliveryMethod) {
      toast({
        title: "Error",
        description: "Please select a delivery method",
        variant: "destructive",
      });
      return;
    }

    onNext(selectedDeliveryMethod, specialInstructions);
  };

  const getEstimatedDeliveryDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isFreeShipping = (methodCost: number) => {
    // Free shipping for orders above ₹999 on standard delivery
    return subtotal >= 999 && methodCost <= 50;
  };

  useEffect(() => {
    fetchDeliveryMethods();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading delivery options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Choose Delivery Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            {deliveryMethods.map((method) => {
              const isFree = isFreeShipping(method.base_cost);
              const finalCost = isFree ? 0 : method.base_cost;
              
              return (
                <div key={method.id} className="flex items-start space-x-3">
                  <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                  <label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="text-primary mt-1">
                            {getDeliveryIcon(method.name)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {method.description}
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">
                              <strong>Estimated delivery:</strong> {getEstimatedDeliveryDate(method.estimated_days)}
                            </div>
                            {subtotal < 999 && method.base_cost <= 50 && (
                              <div className="text-sm text-green-600 mt-1">
                                Free shipping on orders above ₹999
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {isFree ? (
                              <span className="text-green-600">FREE</span>
                            ) : (
                              `₹${finalCost}`
                            )}
                          </div>
                          {isFree && method.base_cost > 0 && (
                            <div className="text-xs text-muted-foreground line-through">
                              ₹{method.base_cost}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Special Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Special Instructions (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add any special delivery instructions here (e.g., call before delivery, leave at door, etc.)"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Order Summary */}
      {selectedMethod && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const selectedDeliveryMethod = deliveryMethods.find(method => method.id === selectedMethod);
              if (!selectedDeliveryMethod) return null;
              
              const isFree = isFreeShipping(selectedDeliveryMethod.base_cost);
              const deliveryCost = isFree ? 0 : selectedDeliveryMethod.base_cost;
              
              return (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery ({selectedDeliveryMethod.name})</span>
                    <span>
                      {isFree ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${deliveryCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{(subtotal + deliveryCost).toFixed(2)}</span>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Address
        </Button>
        <Button onClick={handleNext} disabled={!selectedMethod}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};