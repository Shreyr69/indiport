import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Bell, Globe, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, profile, signOut } = useAuth();
  const { itemCount } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const getDashboardLink = () => {
    if (!profile) return '/';
    switch (profile.role) {
      case 'admin': return '/admin-dashboard';
      case 'seller': return '/seller-dashboard';
      case 'buyer': return '/buyer-dashboard';
      default: return '/';
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-card border-b shadow-custom-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 text-sm text-muted-foreground border-b border-border">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              Global B2B Marketplace
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-foreground">Welcome, {profile?.full_name || user.email}</span>
                {profile?.role === 'seller' && (
                                  <Link to="/seller-dashboard" className="hover:text-foreground transition-colors">
                  Sell on IndiPort
                </Link>
                )}
                {profile?.role === 'admin' && (
                                  <Link to="/admin-dashboard" className="hover:text-foreground transition-colors">
                  Admin
                </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/auth" className="hover:text-foreground transition-colors">
                  Sell on IndiPort
                </Link>
                <Link to="/auth" className="hover:text-foreground transition-colors">
                  My Account
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Globe className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">IndiPort</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
              <Input 
                placeholder="Search products, suppliers, or categories..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-3 text-lg" 
              />
              <Button 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <LanguageSelector />
            {user && (
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            )}
            
            {user && (
              <Link to="/cart">
                  <Button variant="outline" size="sm" className="relative">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {t('nav.cart')}
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-1" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile-settings">
                      <User className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()}>
                      <Settings className="h-4 w-4 mr-2" />
                      {t('nav.dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-1" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-3 border-t border-border">
          <div className="flex items-center gap-6">
            {/* Role-specific primary links first */}
            <Link 
              to="/products" 
              className={`nav-link font-bold text-foreground hover:text-primary transition-colors duration-200 relative ${isActiveRoute('/products') ? 'nav-link-active' : ''}`}
            >
              {t('nav.products')}
            </Link>
            
            {user && profile?.role === 'buyer' && (
              <Link 
                to="/buyer-dashboard" 
                className={`nav-link font-bold text-foreground hover:text-primary transition-colors duration-200 relative ${isActiveRoute('/buyer-dashboard') ? 'nav-link-active' : ''}`}
              >
                My Orders
              </Link>
            )}
            
            {user && profile?.role === 'seller' && (
              <Link 
                to="/seller-dashboard" 
                className={`nav-link font-bold text-foreground hover:text-primary transition-colors duration-200 relative ${isActiveRoute('/seller-dashboard') ? 'nav-link-active' : ''}`}
              >
                My Products
              </Link>
            )}
            
            {user && profile?.role === 'admin' && (
              <Link 
                to="/admin-dashboard" 
                className={`nav-link font-bold text-foreground hover:text-primary transition-colors duration-200 relative ${isActiveRoute('/admin-dashboard') ? 'nav-link-active' : ''}`}
              >
                Manage Platform
              </Link>
            )}
            
            {/* Common links */}
            <Link 
              to="/about" 
              className={`nav-link font-bold text-foreground hover:text-primary transition-colors duration-200 relative ${isActiveRoute('/about') ? 'nav-link-active' : ''}`}
            >
              About
            </Link>
            <Link 
              to="/trade-assurance" 
              className={`nav-link font-bold text-foreground hover:text-primary transition-colors duration-200 relative ${isActiveRoute('/trade-assurance') ? 'nav-link-active' : ''}`}
            >
              Trade Assurance
            </Link>
            <Link 
              to="/help-center" 
              className={`nav-link font-bold text-foreground hover:text-primary transition-colors duration-200 relative ${isActiveRoute('/help-center') ? 'nav-link-active' : ''}`}
            >
              Help Center
            </Link>
            <Link 
              to="/contact-us" 
              className={`nav-link font-bold text-foreground hover:text-primary transition-colors duration-200 relative ${isActiveRoute('/contact-us') ? 'nav-link-active' : ''}`}
            >
              Contact Us
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;