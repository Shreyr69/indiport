import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const addressSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address_line_1: z.string().min(1, 'Address line 1 is required'),
  address_line_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal_code: z.string().min(6, 'Postal code must be at least 6 characters'),
  country: z.string().default('India'),
  is_default: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface Address extends AddressFormData {
  id: string;
  type: 'shipping' | 'billing';
}

interface AddressFormProps {
  onNext: (shippingAddress: Address, billingAddress?: Address) => void;
  onBack: () => void;
}

export const AddressForm = ({ onNext, onBack }: AddressFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [selectedBilling, setBillingAddress] = useState<string>('');
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: 'India',
    },
  });

  // Fetch user addresses
  const fetchAddresses = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch addresses",
        variant: "destructive",
      });
      return;
    }

    setAddresses(data as Address[]);
    
    // Set default selection
    const defaultAddress = data.find(addr => addr.is_default);
    if (defaultAddress) {
      setSelectedShipping(defaultAddress.id);
      setBillingAddress(defaultAddress.id);
    } else if (data.length > 0) {
      setSelectedShipping(data[0].id);
      setBillingAddress(data[0].id);
    }
  };

  // Save new address
  const onSubmit = async (data: AddressFormData) => {
    if (!user) return;
    
    setLoading(true);
    
    const { data: newAddress, error } = await supabase
      .from('user_addresses')
      .insert({
        full_name: data.full_name,
        phone: data.phone,
        address_line_1: data.address_line_1,
        address_line_2: data.address_line_2,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
        is_default: data.is_default,
        user_id: user.id,
        type: 'shipping',
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Success",
      description: "Address saved successfully",
    });

    setAddresses(prev => [...prev, newAddress as Address]);
    setSelectedShipping(newAddress.id);
    setBillingAddress(newAddress.id);
    setShowNewAddressForm(false);
    form.reset();
    setLoading(false);
  };

  const handleNext = () => {
    const shippingAddr = addresses.find(addr => addr.id === selectedShipping);
    const billingAddr = sameAsShipping 
      ? shippingAddr 
      : addresses.find(addr => addr.id === selectedBilling);

    if (!shippingAddr) {
      toast({
        title: "Error",
        description: "Please select a shipping address",
        variant: "destructive",
      });
      return;
    }

    onNext(shippingAddr, billingAddr);
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Select Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
              {addresses.map((address) => (
                <div key={address.id} className="flex items-start space-x-2">
                  <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                  <label htmlFor={address.id} className="flex-1 cursor-pointer">
                    <div className="border rounded-lg p-4 hover:bg-muted/50">
                      <div className="font-medium">{address.full_name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {address.address_line_1}
                        {address.address_line_2 && `, ${address.address_line_2}`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {address.city}, {address.state} {address.postal_code}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Phone: {address.phone}
                      </div>
                      {address.is_default && (
                        <span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-1 rounded mt-2">
                          Default
                        </span>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Add New Address Button */}
      {!showNewAddressForm && (
        <Button
          variant="outline"
          onClick={() => setShowNewAddressForm(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      )}

      {/* New Address Form */}
      {showNewAddressForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address_line_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="House number, street name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address_line_2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Apartment, suite, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="is_default"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Set as default address</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewAddressForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Saving..." : "Save Address"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Billing Address Section */}
      {selectedShipping && (
        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="same-as-shipping"
                  checked={sameAsShipping}
                  onCheckedChange={(checked) => setSameAsShipping(checked === true)}
                />
                <label htmlFor="same-as-shipping" className="text-sm font-medium">
                  Same as shipping address
                </label>
              </div>

              {!sameAsShipping && addresses.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Billing Address
                  </label>
                  <RadioGroup value={selectedBilling} onValueChange={setBillingAddress}>
                    {addresses.map((address) => (
                      <div key={`billing-${address.id}`} className="flex items-start space-x-2">
                        <RadioGroupItem value={address.id} id={`billing-${address.id}`} className="mt-1" />
                        <label htmlFor={`billing-${address.id}`} className="flex-1 cursor-pointer">
                          <div className="border rounded-lg p-4 hover:bg-muted/50">
                            <div className="font-medium">{address.full_name}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {address.address_line_1}
                              {address.address_line_2 && `, ${address.address_line_2}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {address.city}, {address.state} {address.postal_code}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Cart
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!selectedShipping}
        >
          Continue to Delivery
        </Button>
      </div>
    </div>
  );
};