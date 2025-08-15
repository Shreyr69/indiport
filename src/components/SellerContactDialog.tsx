import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Building, User, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface SellerProfile {
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  address: string;
  city: string;
  country: string;
  bio: string;
  verified: boolean;
  avatar_url: string;
}

interface SellerContactDialogProps {
  sellerId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SellerContactDialog = ({ sellerId, isOpen, onOpenChange }: SellerContactDialogProps) => {
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && sellerId) {
      fetchSellerProfile();
    }
  }, [isOpen, sellerId]);

  const fetchSellerProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', sellerId)
        .single();

      if (error) throw error;
      setSellerProfile(data);
    } catch (error) {
      console.error('Error fetching seller profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!sellerProfile) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Seller information not available</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Seller Contact Information
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Seller Basic Info */}
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={sellerProfile.avatar_url} alt={sellerProfile.full_name} />
                <AvatarFallback>
                  {sellerProfile.full_name 
                    ? sellerProfile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
                    : 'S'
                  }
                </AvatarFallback>
              </Avatar>
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {sellerProfile.full_name || 'Seller Name Not Available'}
            </h3>
            {sellerProfile.company_name && (
              <p className="text-muted-foreground">{sellerProfile.company_name}</p>
            )}
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant={sellerProfile.verified ? "default" : "secondary"}>
                {sellerProfile.verified ? "Verified Seller" : "Unverified"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Contact Details</h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{sellerProfile.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`mailto:${sellerProfile.email}`, '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>

              {sellerProfile.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{sellerProfile.phone}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${sellerProfile.phone}`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {(sellerProfile.address || sellerProfile.city || sellerProfile.country) && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {[sellerProfile.address, sellerProfile.city, sellerProfile.country]
                        .filter(Boolean)
                        .join(', ')
                      }
                    </p>
                  </div>
                </div>
              )}

              {sellerProfile.company_name && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Company</p>
                    <p className="text-sm text-muted-foreground">{sellerProfile.company_name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {sellerProfile.bio && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-foreground mb-2">About</h4>
                <p className="text-sm text-muted-foreground">{sellerProfile.bio}</p>
              </div>
            </>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => window.open(`mailto:${sellerProfile.email}`, '_blank')}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            {sellerProfile.phone && (
              <Button
                variant="outline"
                onClick={() => window.open(`tel:${sellerProfile.phone}`, '_blank')}
                className="flex-1"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};