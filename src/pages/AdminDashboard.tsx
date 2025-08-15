import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Package, CheckCircle, XCircle, Eye, Search, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import UserDetailsDialog from '@/components/UserDetailsDialog';

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Fetch users and products on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResult, productsResult, allProductsResult] = await Promise.all([
          supabase.from('profiles').select('*'),
          supabase.from('products').select('*').eq('status', 'pending'),
          supabase.from('products').select('*')
        ]);

        if (usersResult.data) setUsers(usersResult.data);
        if (productsResult.data) setProducts(productsResult.data);
        if (allProductsResult.data) setAllProducts(allProductsResult.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserAction = async (userId: string, action: string) => {
    try {
      let updateData: any = {};
      
      switch (action) {
        case 'Verified':
          updateData = { role: 'seller', verified: true };
          break;
        case 'Approved':
          updateData = { verified: true };
          break;
        case 'Suspended':
          updateData = { verified: false };
          break;
        case 'Rejected':
          updateData = { verified: false };
          break;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      toast({
        title: `User ${action}`,
        description: `User has been ${action.toLowerCase()} successfully`,
      });

      // Refresh users list
      const { data } = await supabase.from('profiles').select('*');
      if (data) setUsers(data);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      // Delete from profiles table
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      
      toast({
        title: "User Deleted",
        description: "User has been deleted successfully"
      });

      // Refresh users list
      const { data } = await supabase.from('profiles').select('*');
      if (data) setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const handleProductAction = async (productId: string, action: string) => {
    try {
      const status = action === 'Approved' ? 'approved' : 'rejected';
      
      await supabase
        .from('products')
        .update({ status })
        .eq('id', productId);

      toast({
        title: `Product ${action}`,
        description: `Product has been ${action.toLowerCase()} successfully`,
      });

      // Refresh products list
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'pending');
      if (data) setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'verified':
        return <Badge className="bg-success-light text-success">Active</Badge>;
      case 'pending':
        return <Badge className="bg-warning-light text-warning">Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-destructive-light text-destructive">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const buyers = users.filter(user => user.role === 'buyer');
  const sellers = users.filter(user => user.role === 'seller');
  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      change: '+12%',
      color: 'text-primary'
    },
    {
      title: 'Active Products',
      value: allProducts.filter(p => p.status === 'approved').length,
      icon: Package,
      change: '+8%',
      color: 'text-success'
    },
    {
      title: 'Pending Reviews',
      value: products.length,
      icon: AlertTriangle,
      change: '-15%',
      color: 'text-warning'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="heading-primary mb-2">Admin Dashboard</h1>
          <p className="text-body">Manage users, moderate products, and oversee platform operations</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className={`text-sm ${stat.color}`}>{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Product Moderation
            </TabsTrigger>
          </TabsList>

          {/* Analytics */}
          <TabsContent value="analytics" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users" className="mt-6">
            <Card className="card-elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading users...</p>
                  </div>
                ) : (
                  <Tabs defaultValue="buyers" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="buyers">Buyers ({buyers.length})</TabsTrigger>
                      <TabsTrigger value="sellers">Sellers ({sellers.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="buyers" className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.filter(user => user.role === 'buyer').map((buyer) => (
                            <TableRow key={buyer.id}>
                              <TableCell className="font-medium">{buyer.full_name || 'N/A'}</TableCell>
                              <TableCell>{buyer.email}</TableCell>
                              <TableCell>{buyer.company_name || 'N/A'}</TableCell>
                              <TableCell>{getStatusBadge(buyer.verified ? 'verified' : 'pending')}</TableCell>
                              <TableCell>{new Date(buyer.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setSelectedUser(buyer)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleDeleteUser(buyer.user_id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  {!buyer.verified ? (
                                    <Button 
                                      size="sm" 
                                      className="btn-primary"
                                      onClick={() => handleUserAction(buyer.user_id, 'Approved')}
                                    >
                                      Verify
                                    </Button>
                                  ) : (
                                    <Badge className="bg-success-light text-success px-2 py-1">
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>

                    <TabsContent value="sellers" className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Company Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.filter(user => user.role === 'seller').map((seller) => (
                            <TableRow key={seller.id}>
                              <TableCell className="font-medium">{seller.company_name || seller.full_name}</TableCell>
                              <TableCell>{seller.email}</TableCell>
                              <TableCell>{seller.city || seller.country || 'N/A'}</TableCell>
                              <TableCell>{getStatusBadge(seller.verified ? 'verified' : 'pending')}</TableCell>
                              <TableCell>{new Date(seller.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setSelectedUser(seller)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleDeleteUser(seller.user_id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  {!seller.verified ? (
                                    <Button 
                                      size="sm" 
                                      className="btn-primary"
                                      onClick={() => handleUserAction(seller.user_id, 'Verified')}
                                    >
                                      Verify
                                    </Button>
                                  ) : (
                                    <Badge className="bg-success-light text-success px-2 py-1">
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Product Moderation */}
          <TabsContent value="products" className="mt-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Product Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading products...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {products.map((product) => (
                      <div key={product.id} className="border border-border rounded-lg p-4">
                        <div className="flex gap-4">
                          <img
                            src={product.image_url || '/placeholder.svg'}
                            alt={product.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2">{product.title}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Price:</span>
                                <p className="font-medium">${product.price}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Category:</span>
                                <p className="font-medium">{product.category}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Stock:</span>
                                <p className="font-medium">{product.stock_quantity}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Min Order:</span>
                                <p className="font-medium">{product.min_order} {product.unit}</p>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            className="btn-primary"
                            onClick={() => handleProductAction(product.id, 'Approved')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleProductAction(product.id, 'Rejected')}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}

                    {products.length === 0 && (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No pending products</h3>
                        <p className="text-muted-foreground">
                          All products have been reviewed
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Details Dialog */}
        <UserDetailsDialog
          user={selectedUser}
          open={!!selectedUser}
          onOpenChange={(open) => !open && setSelectedUser(null)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;