import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Star, MapPin, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useSavedProducts } from '@/hooks/useSavedProducts';
import SearchSuggestions from '@/components/SearchSuggestions';
import { useLanguage } from '@/contexts/LanguageContext';
import { StarRating } from '@/components/StarRating';
import { useProductRatings } from '@/hooks/useReviews';

const ProductListings = () => {
  const { products, categories, loading } = useProducts();
  const { addToCart } = useCart();
  const { saveProduct, isProductSaved } = useSavedProducts();
  const { ratings } = useProductRatings(products.map(p => p.id));
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        if (max) return product.price >= min && product.price <= max;
        return product.price >= min;
      });
    }

    if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'featured') {
      filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (productId: string) => {
    addToCart(productId, 1);
  };

  const handleSaveProduct = (productId: string) => {
    saveProduct(productId);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('products.title')}</h1>
          <p className="text-xl opacity-90">Discover quality products from verified suppliers</p>
        </div>
      </section>

      {/* Search and Filters */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <SearchSuggestions
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={setSearchTerm}
              onCategorySelect={setSelectedCategory}
            />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-elevated p-6 space-y-6 sticky top-4">
              <h3 className="heading-secondary">{t('products.filters')}</h3>
              
              {/* Category Filter */}
              <div>
                <label className="label-text mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="label-text mb-2 block">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-50">$0 - $50</SelectItem>
                    <SelectItem value="50-100">$50 - $100</SelectItem>
                    <SelectItem value="100-500">$100 - $500</SelectItem>
                    <SelectItem value="500">$500+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="label-text mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {filteredProducts.length} products found
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading products...</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map(product => (
                  <div key={product.id} className="card-interactive p-4">
                    <div className={`${viewMode === 'list' ? 'flex gap-4' : ''}`}>
                      <Link 
                        to={`/products/${product.id}`}
                        className={`${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'w-full h-48'} overflow-hidden rounded-lg bg-muted block`}
                      >
                        <img
                          src={product.image_url || (product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg')}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      
                      <div className={`${viewMode === 'list' ? 'flex-1' : 'mt-4'}`}>
                        <Link to={`/products/${product.id}`}>
                          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary">
                            {product.title}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-primary">
                            ${product.price}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            / {product.unit}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <StarRating rating={ratings.get(product.id)?.averageRating || 0} size="sm" />
                          <span className="text-sm text-muted-foreground">
                            ({ratings.get(product.id)?.reviewCount || 0})
                          </span>
                        </div>

                        {product.featured && (
                          <Badge className="bg-accent-light text-accent mb-2">
                            Featured
                          </Badge>
                        )}

                        <div className="text-sm text-muted-foreground mb-3">
                          <span>{product.location || 'Location not specified'}</span>
                        </div>

                        <div className="text-sm text-muted-foreground mb-4">
                          Min. order: {product.min_order} {product.unit}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">
                            Stock: {product.stock_quantity}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSaveProduct(product.id)}
                              className={isProductSaved(product.id) ? "text-red-500 border-red-500" : ""}
                            >
                              <Heart className={`h-4 w-4 ${isProductSaved(product.id) ? "fill-current" : ""}`} />
                            </Button>
                            <Button 
                              size="sm" 
                              className="btn-primary"
                              onClick={() => handleAddToCart(product.id)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              {t('common.add_to_cart')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">{t('products.no_products')}</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductListings;