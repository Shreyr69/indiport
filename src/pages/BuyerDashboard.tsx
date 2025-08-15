import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Package, Eye, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useRFQ } from '@/hooks/useRFQ';
import { useOrders } from '@/hooks/useOrders';
import { useSavedProducts } from '@/hooks/useSavedProducts';
import OrderDetailsDialog from '@/components/OrderDetailsDialog';
const BuyerDashboard = () => {
  const { rfqs, loading: rfqLoading } = useRFQ();
  const { orders, loading: orderLoading } = useOrders();
  const { savedProducts, loading: savedLoading, removeSavedProduct } = useSavedProducts();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning-light text-warning';
      case 'responded': return 'bg-success-light text-success';
      case 'negotiating': return 'bg-primary-light text-primary';
      case 'closed': return 'bg-muted text-muted-foreground';
      case 'shipped': return 'bg-primary-light text-primary';
      case 'delivered': return 'bg-success-light text-success';
      case 'cancelled': return 'bg-destructive-light text-destructive';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="heading-primary mb-2">Buyer Dashboard</h1>
          <p className="text-body">Manage your inquiries, orders, and saved products</p>
        </div>

        <Tabs defaultValue="inquiries" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              My Inquiries
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Saved Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order History
            </TabsTrigger>
          </TabsList>

          {/* My Inquiries */}
          <TabsContent value="inquiries" className="mt-6">
            <div className="space-y-4">
              {rfqLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : rfqs.length > 0 ? (
                rfqs.map((rfq) => (
                  <Card key={rfq.id} className="card-elevated">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{rfq.products?.title || 'Product'}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Submitted on {new Date(rfq.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(rfq.status)}>
                          {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium">Quantity:</span>
                          <p className="text-sm text-muted-foreground">{rfq.quantity} units</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Company:</span>
                          <p className="text-sm text-muted-foreground">{rfq.company_name}</p>
                        </div>
                      </div>
                      
                      {rfq.message && (
                        <div className="mb-4">
                          <span className="text-sm font-medium">Message:</span>
                          <p className="text-sm text-muted-foreground mt-1">{rfq.message}</p>
                        </div>
                      )}

                      {rfq.status === 'responded' && rfq.quoted_price && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium mb-3">Supplier Response:</h4>
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm text-primary font-semibold">
                                Quoted Price: ${rfq.quoted_price} per unit
                              </span>
                            </div>
                            {rfq.seller_response && (
                              <p className="text-sm text-muted-foreground">{rfq.seller_response}</p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/products/${rfq.product_id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Product
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="card-elevated">
                  <CardContent className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No inquiries yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by browsing products and sending inquiries to suppliers
                    </p>
                    <Link to="/products">
                      <Button className="btn-primary">Browse Products</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Saved Products */}
          <TabsContent value="saved" className="mt-6">
            <div className="space-y-4">
              {savedLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : savedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedProducts.map((savedProduct) => (
                    <Card key={savedProduct.id} className="card-interactive">
                      <CardContent className="p-4">
                        <div className="relative mb-4">
                          <img
                            src={savedProduct.products.image_url || (savedProduct.products.images && savedProduct.products.images.length > 0 ? savedProduct.products.images[0] : '/placeholder.svg')}
                            alt={savedProduct.products.title}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        </div>
                        
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          {savedProduct.products.title}
                        </h3>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-semibold text-primary">${savedProduct.products.price}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Category:</span>
                            <span>{savedProduct.products.category}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Stock:</span>
                            <span>{savedProduct.products.stock_quantity}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Min Order:</span>
                            <span>{savedProduct.products.min_order} {savedProduct.products.unit}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => navigate(`/products/${savedProduct.product_id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => removeSavedProduct(savedProduct.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="card-elevated">
                  <CardContent className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No saved products yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Save products while browsing to view them here later
                    </p>
                    <Link to="/products">
                      <Button className="btn-primary">Browse Products</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Order History */}
          <TabsContent value="orders" className="mt-6">
            <div className="space-y-4">
              {orderLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <Card key={order.id} className="card-elevated">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {order.order_items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                            <div>
                              <p className="font-medium">{item.products.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity} {item.products.unit} × ${item.unit_price} = ${item.total_price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <div>
                          <p className="text-lg font-bold">Total: ${order.total_amount}</p>
                          <p className="text-sm text-muted-foreground">
                            Shipping: ${order.shipping_cost} | Tax: ${order.tax_amount}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="card-elevated">
                  <CardContent className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Your order history will appear here once you make your first purchase
                    </p>
                    <Link to="/products">
                      <Button className="btn-primary">Start Shopping</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Order Details Dialog */}
        <OrderDetailsDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
        />
      </div>
    </div>
  );
};

export default BuyerDashboard;