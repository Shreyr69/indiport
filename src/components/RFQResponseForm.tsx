import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RFQType } from '@/hooks/useRFQ';

interface RFQResponseFormProps {
  rfq: RFQType;
  onResponse: (rfqId: string, quotedPrice: number, response: string) => Promise<boolean>;
}

const RFQResponseForm = ({ rfq, onResponse }: RFQResponseFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quotedPrice: '',
    response: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.quotedPrice || !formData.response) return;

    setLoading(true);
    const success = await onResponse(
      rfq.id,
      parseFloat(formData.quotedPrice),
      formData.response
    );

    if (success) {
      setFormData({ quotedPrice: '', response: '' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quotedPrice" className="label-text">Your Price (USD per unit) *</Label>
          <Input
            id="quotedPrice"
            type="number"
            step="0.01"
            min="0"
            required
            value={formData.quotedPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, quotedPrice: e.target.value }))}
            placeholder="Enter your price"
            className="mt-1"
          />
        </div>
        <div className="flex items-end">
          <div className="text-sm text-muted-foreground">
            Total: ${formData.quotedPrice ? (parseFloat(formData.quotedPrice) * rfq.quantity).toFixed(2) : '0.00'}
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="response" className="label-text">Response Message *</Label>
        <Textarea
          id="response"
          required
          value={formData.response}
          onChange={(e) => setFormData(prev => ({ ...prev, response: e.target.value }))}
          placeholder="Write your response to the buyer..."
          className="mt-1"
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <Button 
          type="submit"
          className="btn-primary"
          disabled={loading || !formData.quotedPrice || !formData.response}
        >
          {loading ? 'Sending...' : 'Send Response'}
        </Button>
        <Button type="button" variant="outline">
          Decline
        </Button>
      </div>
    </form>
  );
};

export default RFQResponseForm;