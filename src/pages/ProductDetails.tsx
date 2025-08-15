import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Shield, Truck, MessageSquare, ShoppingCart, ArrowLeft, Plus, Minus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedProducts } from '@/hooks/useSavedProducts';
import RFQForm from '@/components/RFQForm';
import { StarRating } from '@/components/StarRating';
import { ReviewsList } from '@/components/ReviewsList';
import { useProductRating } from '@/hooks/useReviews';
import { SellerContactDialog } from '@/components/SellerContactDialog';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { saveProduct, isProductSaved } = useSavedProducts();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showSellerContact, setShowSellerContact] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { rating } = useProductRating(id || "");

  // Fetch product by ID (including pending products for sellers/admins)
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);

        // Fetch seller profile
        if (data?.seller_id) {
          const { data: sellerData } = await supabase
            .from('profiles')
            .select('full_name, company_name, verified')
            .eq('user_id', data.seller_id)
            .single();
          
          setSellerProfile(sellerData);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products" className="text-primary hover:underline">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const handleSaveProduct = () => {
    saveProduct(product.id);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/products" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={(product.images && product.images.length > 0) ? product.images[selectedImage] : product.image_url || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="heading-primary mb-4">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">
                  ${product.price}
                </span>
                <span className="text-muted-foreground">per {product.unit}</span>
                <Badge className="bg-accent-light text-accent-foreground">
                  MOQ: {product.min_order} {product.unit}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={rating.averageRating} showValue />
                <span className="text-sm text-muted-foreground">
                  ({rating.reviewCount} review{rating.reviewCount !== 1 ? 's' : ''})
                </span>
              </div>
            </div>

            {/* Seller Info */}
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Seller Information</h3>
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {sellerProfile?.full_name || 'Seller Name'}
                        </span>
                        {sellerProfile?.verified && (
                          <Badge variant="default" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      {sellerProfile?.company_name && (
                        <p className="text-sm text-muted-foreground">{sellerProfile.company_name}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {product.location || 'Location not specified'}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Stock: {product.stock_quantity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowSellerContact(true)}
                  >
                    Contact Seller
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="quantity" className="label-text">Quantity</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">{product.unit}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleSaveProduct}
                  className={isProductSaved(product.id) ? "text-red-500 border-red-500" : ""}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isProductSaved(product.id) ? "fill-current" : ""}`} />
                  {isProductSaved(product.id) ? 'Saved' : 'Save'}
                </Button>
                <Button onClick={handleAddToCart} className="btn-primary flex-1">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Dialog open={showInquiryModal} onOpenChange={setShowInquiryModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Inquiry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Send Inquiry for {product.title}</DialogTitle>
                    </DialogHeader>
                    <RFQForm
                      productId={product.id}
                      sellerId={product.seller_id}
                      productTitle={product.title}
                      onSuccess={() => setShowInquiryModal(false)}
                      onCancel={() => setShowInquiryModal(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Free shipping on orders over $1000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-body">{product.description}</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium text-foreground">Category:</span>
                    <span className="text-muted-foreground">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium text-foreground">Unit:</span>
                    <span className="text-muted-foreground">{product.unit}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium text-foreground">Minimum Order:</span>
                    <span className="text-muted-foreground">{product.min_order} {product.unit}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium text-foreground">Stock Quantity:</span>
                    <span className="text-muted-foreground">{product.stock_quantity}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium text-foreground">Status:</span>
                    <span className="text-muted-foreground">{product.status}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium text-foreground">Featured:</span>
                    <span className="text-muted-foreground">{product.featured ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Shipping Information</h4>
                  <ul className="space-y-1 text-body">
                    <li>• Standard shipping: 7-14 business days</li>
                    <li>• Express shipping: 3-5 business days</li>
                    <li>• Free shipping on orders over $1000</li>
                    <li>• International shipping available</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Returns & Warranty</h4>
                  <ul className="space-y-1 text-body">
                    <li>• 30-day return policy</li>
                    <li>• Manufacturer warranty included</li>
                    <li>• Quality guarantee</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reviews Section */}
        <div className="mt-8">
          <ReviewsList productId={product.id} />
        </div>

        {/* Seller Contact Dialog */}
        <SellerContactDialog 
          sellerId={product.seller_id}
          isOpen={showSellerContact}
          onOpenChange={setShowSellerContact}
        />
      </div>
    </>
  );
};

export default ProductDetails;