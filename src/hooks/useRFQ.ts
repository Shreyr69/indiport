import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface RFQType {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  quantity: number;
  message: string | null;
  status: string;
  quoted_price: number | null;
  seller_response: string | null;
  response_date: string | null;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  created_at: string;
  products?: {
    title: string;
    price: number;
    unit: string;
    image_url: string | null;
  };
  buyer_name?: string;
  buyer_company?: string;
}

export const useRFQ = () => {
  const [rfqs, setRFQs] = useState<RFQType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const fetchRFQs = async () => {
    if (!user) {
      setRFQs([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('rfqs')
        .select(`
          *,
          products (
            title,
            price,
            unit,
            image_url
          )
        `);

      // Filter based on user role
      if (profile?.role === 'buyer') {
        query = query.eq('buyer_id', user.id);
      } else if (profile?.role === 'seller') {
        query = query.eq('seller_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setRFQs(data || []);
    } catch (error) {
      console.error('Error fetching RFQs:', error);
      toast({
        title: "Error",
        description: "Failed to load inquiries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createRFQ = async (rfqData: {
    productId: string;
    sellerId: string;
    quantity: number;
    message?: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone?: string;
  }) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to send inquiries",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('rfqs')
        .insert({
          product_id: rfqData.productId,
          buyer_id: user.id,
          seller_id: rfqData.sellerId,
          quantity: rfqData.quantity,
          message: rfqData.message,
          company_name: rfqData.companyName,
          contact_person: rfqData.contactPerson,
          email: rfqData.email,
          phone: rfqData.phone,
          status: 'pending'
        });

      if (error) throw error;

      await fetchRFQs();
      toast({
        title: "Inquiry sent",
        description: "Your inquiry has been sent to the supplier"
      });
      return true;
    } catch (error) {
      console.error('Error creating RFQ:', error);
      toast({
        title: "Error",
        description: "Failed to send inquiry",
        variant: "destructive"
      });
      return false;
    }
  };

  const respondToRFQ = async (rfqId: string, quotedPrice: number, response: string) => {
    try {
      const { error } = await supabase
        .from('rfqs')
        .update({
          quoted_price: quotedPrice,
          seller_response: response,
          response_date: new Date().toISOString(),
          status: 'responded'
        })
        .eq('id', rfqId);

      if (error) throw error;

      await fetchRFQs();
      toast({
        title: "Response sent",
        description: "Your response has been sent to the buyer"
      });
      return true;
    } catch (error) {
      console.error('Error responding to RFQ:', error);
      toast({
        title: "Error",
        description: "Failed to send response",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchRFQs();
  }, [user, profile]);

  return {
    rfqs,
    loading,
    createRFQ,
    respondToRFQ,
    refetchRFQs: fetchRFQs
  };
};