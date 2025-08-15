import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRFQ } from '@/hooks/useRFQ';

interface RFQFormProps {
  productId: string;
  sellerId: string;
  productTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const RFQForm = ({ productId, sellerId, productTitle, onSuccess, onCancel }: RFQFormProps) => {
  const { user, profile } = useAuth();
  const { createRFQ } = useRFQ();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity: '',
    message: '',
    companyName: profile?.company_name || '',
    contactPerson: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const success = await createRFQ({
      productId,
      sellerId,
      quantity: parseInt(formData.quantity),
      message: formData.message,
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone
    });

    setLoading(false);
    if (success) {
      onSuccess?.();
    }
  };

  if (!user) {
    return (
      <Card className="card-elevated">
        <CardContent className="text-center py-8">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sign in to send inquiry</h3>
          <p className="text-muted-foreground mb-4">
            You need to be signed in to send inquiries to suppliers
          </p>
          <Button className="btn-primary">Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle>Send Inquiry for: {productTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity" className="label-text">Quantity Needed *</Label>
              <Input
                id="quantity"
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Enter quantity"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="companyName" className="label-text">Company Name *</Label>
              <Input
                id="companyName"
                required
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Your company name"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPerson" className="label-text">Contact Person *</Label>
              <Input
                id="contactPerson"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                placeholder="Your full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email" className="label-text">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="label-text">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 (555) 000-0000"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="message" className="label-text">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Additional details about your requirements..."
              className="mt-1"
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Inquiry'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RFQForm;