import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Globe, Truck, Headphones, Leaf, Car, FlaskConical, HardHat, Zap, Utensils, Cog, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useProducts';
import HeroCarousel from '@/components/HeroCarousel';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
const Index = () => {
  const {
    products,
    categories,
    loading
  } = useProducts();
  const featuredProducts = products.slice(0, 4);
  const featuredCategories = categories.slice(0, 8);
  return <>
      {/* Hero Section */}
      <section className="text-white min-h-screen flex items-center justify-center relative overflow-hidden">
        <HeroCarousel />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Global B2B Trade<br />
            <span className="text-accent">Made Simple</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Connect with millions of suppliers worldwide. Source products, negotiate prices, and grow your business with IndiPort's trusted B2B marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="btn-accent text-lg px-8 py-4">
                Start Sourcing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/seller-dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-blue-500 bg-white">
                Become a Supplier
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-primary mb-4">Why Choose IndiPort?</h2>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-2xl mx-auto">
              Join millions of businesses that trust IndiPort for their global sourcing and trading needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
            icon: Shield,
            title: 'Verified Suppliers',
            description: 'All suppliers are verified and quality-assured for your peace of mind'
          }, {
            icon: Globe,
            title: 'Global Reach',
            description: 'Access suppliers from 200+ countries and territories worldwide'
          }, {
            icon: Truck,
            title: 'Secure Logistics',
            description: 'End-to-end shipping solutions with real-time tracking'
          }, {
            icon: Headphones,
            title: '24/7 Support',
            description: 'Round-the-clock customer support in multiple languages'
          }].map((feature, index) => <Card key={index} className="card-elevated text-center">
                <CardContent className="p-6">
                  <div className="bg-primary-light p-3 rounded-full w-fit mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-primary mb-4">Popular Categories</h2>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-2xl mx-auto">
              Explore millions of products across various industries and categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {loading ?
          // Loading skeleton for categories
          Array.from({
            length: 8
          }).map((_, index) => <div key={index} className="card-interactive p-4 text-center animate-pulse">
                  <div className="bg-muted p-3 rounded-full w-12 h-12 mx-auto mb-3"></div>
                  <div className="h-4 bg-muted rounded mb-1"></div>
                  <div className="h-3 bg-muted rounded w-2/3 mx-auto"></div>
                </div>) : featuredCategories.map(category => {
                // Map category names to appropriate icons
                const getCategoryIcon = (categoryName: string) => {
                  const name = categoryName.toLowerCase();
                  if (name.includes('agriculture') || name.includes('farm')) return Leaf;
                  if (name.includes('automotive') || name.includes('car')) return Car;
                  if (name.includes('chemical') || name.includes('pharma')) return FlaskConical;
                  if (name.includes('construction') || name.includes('building')) return HardHat;
                  if (name.includes('electronic') || name.includes('tech')) return Zap;
                  if (name.includes('food') || name.includes('beverage')) return Utensils;
                  if (name.includes('machinery') || name.includes('industrial')) return Cog;
                  if (name.includes('textile') || name.includes('fabric')) return Scissors;
                  return Globe; // Default icon
                };
                
                const CategoryIcon = getCategoryIcon(category.name);
                
                return <Link key={category.id} to={`/products?category=${encodeURIComponent(category.name)}`} className="card-interactive p-4 text-center">
                  <div className="bg-primary-light p-3 rounded-full w-fit mx-auto mb-3">
                    <CategoryIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground text-base sm:text-lg mb-1">{category.name}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Browse products</p>
                </Link>;
              })}
          </div>

          <div className="text-center mt-8">
            <Link to="/products">
              <Button variant="outline" size="lg">
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-primary mb-4">Featured Products</h2>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-2xl mx-auto">
              Discover trending products from verified suppliers worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ?
          // Loading skeleton
          Array.from({
            length: 4
          }).map((_, index) => <div key={index} className="card-interactive animate-pulse">
                  <div className="aspect-square bg-muted rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-6 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </div>) : featuredProducts.map(product => <Link key={product.id} to={`/products/${product.id}`} className="card-interactive">
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img src={product.image_url || '/placeholder.svg'} alt={product.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-base sm:text-lg md:text-xl">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl sm:text-3xl font-bold text-primary">
                        ${product.price}
                      </span>
                      <span className="text-base sm:text-lg text-muted-foreground">
                        / {product.unit}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="text-base sm:text-lg text-muted-foreground">4.8</span>
                      </div>
                      {product.seller_verified &&                         <Badge variant="secondary" className="text-sm sm:text-base">
                          Verified
                        </Badge>}
                    </div>

                    <p className="text-base sm:text-lg text-muted-foreground">
                      {product.location || 'Global Supplier'}
                    </p>
                  </div>
                </Link>)}
          </div>

          <div className="text-center mt-8">
            <Link to="/products">
              <Button size="lg" className="btn-primary">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-primary mb-4">What Our Customers Say</h2>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto">
              Join thousands of satisfied businesses that trust IndiPort for their global sourcing needs
            </p>
          </div>
          
          <TestimonialsCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of businesses already trading on IndiPort. Start sourcing or selling today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/buyer-dashboard">
              <Button size="lg" className="btn-accent text-lg px-8 py-4">
                Start Buying
              </Button>
            </Link>
            <Link to="/seller-dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white bg-slate-50 text-blue-500">
                Start Selling
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-blue-500 bg-slate-50">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <Globe className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">IndiPort</span>
              </Link>
              <p className="text-muted-foreground text-base sm:text-lg">
                The world's leading B2B marketplace connecting buyers and suppliers globally.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">For Buyers</h3>
              <ul className="space-y-2 text-base sm:text-lg text-muted-foreground">
                <li><Link to="/products" className="hover:text-foreground">Browse Products</Link></li>
                <li><Link to="/buyer-dashboard" className="hover:text-foreground">Buyer Dashboard</Link></li>
                <li><Link to="/cart" className="hover:text-foreground">Shopping Cart</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">For Suppliers</h3>
              <ul className="space-y-2 text-base sm:text-lg text-muted-foreground">
                <li><Link to="/seller-dashboard" className="hover:text-foreground">Seller Dashboard</Link></li>
                <li><Link to="/seller-dashboard" className="hover:text-foreground">Add Products</Link></li>
                <li><Link to="/seller-dashboard" className="hover:text-foreground">Manage RFQs</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-base sm:text-lg text-muted-foreground">
                <li><Link to="/help-center" className="hover:text-foreground">Help Center</Link></li>
                <li><Link to="/contact-us" className="hover:text-foreground">Contact Us</Link></li>
                <li><Link to="/trade-assurance" className="hover:text-foreground">Trade Assurance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-base sm:text-lg text-muted-foreground">
            <p>&copy; 2024 IndiPort. All rights reserved. | Built with modern web technologies</p>
          </div>
        </div>
      </footer>
    </>;
};
export default Index;