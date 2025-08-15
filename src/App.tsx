import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProductListings from "./pages/ProductListings";
import ProductDetails from "./pages/ProductDetails";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Cart from "./pages/Cart";
import ProfileSettings from "./pages/ProfileSettings";
import About from "./pages/About";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/ContactUs";
import TradeAssurance from "./pages/TradeAssurance";
import NotFound from "./pages/NotFound";
import { CheckoutFlow } from "./components/CheckoutFlow";
import { OrderConfirmation } from "./components/OrderConfirmation";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const hideHeader = location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-background">
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/products" element={<ProductListings />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/buyer-dashboard" element={
          <ProtectedRoute requiredRole="buyer">
            <BuyerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/seller-dashboard" element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutFlow />
          </ProtectedRoute>
        } />
        <Route path="/checkout/confirmation" element={
          <ProtectedRoute>
            <OrderConfirmation />
          </ProtectedRoute>
        } />
        <Route path="/profile-settings" element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/trade-assurance" element={<TradeAssurance />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
