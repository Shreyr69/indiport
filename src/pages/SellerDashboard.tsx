import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, MessageSquare, Edit, Trash2, Eye } from 'lucide-react';
import { useMyProducts } from '@/hooks/useProducts';
import { useRFQ } from '@/hooks/useRFQ';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ProductForm from '@/components/ProductForm';
import RFQResponseForm from '@/components/RFQResponseForm';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import ProductEditDialog from '@/components/ProductEditDialog';

const SellerDashboard = () => {
  const { user } = useAuth();
  const { products: myProducts, loading: productsLoading, refetchProducts } = useMyProducts();
  const { rfqs, loading: rfqsLoading, respondToRFQ } = useRFQ();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully"
      });

      refetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="heading-primary mb-2">Seller Dashboard</h1>
          <p className="text-body">Manage your products, respond to inquiries, and track your business</p>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              My Products
            </TabsTrigger>
            <TabsTrigger value="add-product" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="rfqs" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              RFQ Responses
            </TabsTrigger>
          </TabsList>

          {/* My Products */}
          <TabsContent value="products" className="mt-6">
            {productsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading products...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProducts.map((product) => (
                    <Card key={product.id} className="card-interactive">
                      <CardContent className="p-4">
                        <div className="relative mb-4">
                          <img
                            src={product.image_url || (product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg')}
                            alt={product.title}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <Badge className={`absolute top-2 left-2 ${
                            product.status === 'approved' ? 'bg-success-light text-success' :
                            product.status === 'pending' ? 'bg-warning-light text-warning' :
                            'bg-destructive-light text-destructive'
                          }`}>
                            {product.status}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-semibold text-primary">${product.price}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Stock:</span>
                            <span>{product.stock_quantity}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Min Order:</span>
                            <span>{product.min_order} {product.unit}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Category:</span>
                            <span>{product.category}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {myProducts.length === 0 && (
                  <Card className="card-elevated">
                    <CardContent className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Add your first product to start selling on IndiPort
                      </p>
                      <Button className="btn-primary">Add Product</Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* Add Product */}
          <TabsContent value="add-product" className="mt-6">
            <ProductForm />
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>

          {/* RFQ Responses */}
          <TabsContent value="rfqs" className="mt-6">
            {rfqsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading inquiries...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rfqs.map((rfq) => (
                  <Card key={rfq.id} className="card-elevated">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{rfq.products?.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Inquiry from {rfq.company_name} • {new Date(rfq.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={`${
                          rfq.status === 'pending' ? 'bg-warning-light text-warning' :
                          rfq.status === 'responded' ? 'bg-success-light text-success' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {rfq.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium">Quantity Needed:</span>
                          <p className="text-sm text-muted-foreground">{rfq.quantity} units</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Contact Person:</span>
                          <p className="text-sm text-muted-foreground">{rfq.contact_person}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Email:</span>
                          <p className="text-sm text-muted-foreground">{rfq.email}</p>
                        </div>
                      </div>
                      
                      {rfq.message && (
                        <div className="mb-4">
                          <span className="text-sm font-medium">Buyer Message:</span>
                          <p className="text-sm text-muted-foreground mt-1 bg-muted p-3 rounded-lg">
                            {rfq.message}
                          </p>
                        </div>
                      )}

                      {rfq.status === 'responded' ? (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium mb-3">Your Response:</h4>
                          <div className="bg-success-light p-4 rounded-lg">
                            <p className="text-sm"><strong>Quoted Price:</strong> ${rfq.quoted_price}</p>
                            <p className="text-sm mt-2"><strong>Response:</strong> {rfq.seller_response}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Responded on {rfq.response_date ? new Date(rfq.response_date).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium mb-3">Send Your Response:</h4>
                          <RFQResponseForm rfq={rfq} onResponse={respondToRFQ} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {rfqs.length === 0 && (
                  <Card className="card-elevated">
                    <CardContent className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No inquiries yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Buyer inquiries will appear here when customers are interested in your products
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Product Edit Dialog */}
        <ProductEditDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          onProductUpdated={() => {
            refetchProducts();
            setEditingProduct(null);
          }}
        />
      </div>
    </div>
  );
};

export default SellerDashboard;