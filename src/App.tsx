import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { initializeGSAPOptimizations } from "@/lib/animationConfig";
import serviceWorker from "@/utils/serviceWorker";
import { preloadCriticalComponents } from "@/utils/lazyLoading";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SetupDashboard from "./pages/SetupDashboard";
import { SupabaseConnectionTest } from "@/components/SupabaseConnectionTest";
import TestMigrations from "@/components/TestMigrations";
import ProductsShowcase from "@/components/ProductsShowcase";
import DatabaseSetupComponent from "@/components/DatabaseSetupComponent";
import AuthDebugger from "@/components/AuthDebugger";

// Keep critical auth pages non-lazy
import RoleSelection from "./pages/auth/RoleSelection";
import Login from "./pages/auth/Login";
import SimpleLogin from "./pages/auth/SimpleLogin";
import NotFound from "./pages/NotFound";

// Dashboard layouts (keep non-lazy for better UX)
import WarehouseDashboardLayout from "./components/warehouse/WarehouseDashboardLayout";
import DeliveryPartnerDashboardLayout from "./components/delivery/DeliveryPartnerDashboardLayout";
import AdminDashboardLayout from "./components/admin/AdminDashboardLayout";

// Import lazy components
import {
  LazySetupPage,
  LazyCustomerDashboard,
  LazyCheckout,
  LazyCustomerOrders,
  LazyCustomerOrderTracking,
  LazyOrderConfirmation,
  LazyFarmerDashboard,
  LazyCropRecommendations,
  LazyWarehouseFinder,
  LazySellProducts,
  LazyPesticidesGuide,
  LazyFarmerProfile,
  LazyWarehouseDashboard,
  LazyConfirmArrivals,
  LazyInventoryManagement,
  LazyMonthlyReport,
  LazyConfirmPickup,
  LazyWarehouseProfile,
  LazyDeliveryPartnerDashboard,
  LazyDeliveryOrderManagement,
  LazyPickupConfirmation,
  LazyDeliveryTracking,
  LazyDeliveryConfirmation,
  LazyDeliveryPartnerProfile,
  LazyAdminDashboard,
  LazyUserManagement,
  LazyWarehouseManagement,
  LazyAdminOrderManagement,
  LazyAdminAnalytics,
  LazyMarketingTools,
  LazySystemSettings,
  LazyRegistration,
  LazyVerification
} from "@/utils/lazyLoading";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize GSAP optimizations on app load
    initializeGSAPOptimizations();
    
    // Register service worker for PWA functionality
    if (import.meta.env.PROD) {
      serviceWorker.register({
        onSuccess: (registration) => {
          console.log('SW registered: ', registration);
        },
        onUpdate: (registration) => {
          console.log('SW updated: ', registration);
          // Could show a toast here to inform user of update
        }
      });
    }
    
    // Setup PWA install prompt
    serviceWorker.setupPWAInstall();
    
    // Setup network monitoring
    serviceWorker.setupNetworkMonitoring();
    
    // Prefetch critical routes
    serviceWorker.prefetchRoutes();
    
    // Preload critical components
    preloadCriticalComponents();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SmoothScrollProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/setup" element={<LazySetupPage />} />
            <Route path="/setup-dashboard" element={<SetupDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/test-connection" element={
              <div className="min-h-screen bg-background p-8 space-y-8">
                <SupabaseConnectionTest />
                <DatabaseSetupComponent />
                <TestMigrations />
                <ProductsShowcase />
              </div>
            } />
            <Route path="/auth-debug" element={<AuthDebugger />} />
            <Route path="/farmer/dashboard" element={<LazyFarmerDashboard />} />
            <Route path="/farmer/crops" element={<LazyCropRecommendations />} />
            <Route path="/farmer/warehouses" element={<LazyWarehouseFinder />} />
            <Route path="/farmer/sell" element={<LazySellProducts />} />
            <Route path="/farmer/pesticides" element={<LazyPesticidesGuide />} />
            <Route path="/farmer/profile" element={<LazyFarmerProfile />} />
            
            {/* Warehouse Management Routes */}
            <Route path="/warehouse/dashboard" element={<WarehouseDashboardLayout><LazyWarehouseDashboard /></WarehouseDashboardLayout>} />
            <Route path="/warehouse/arrivals" element={<WarehouseDashboardLayout><LazyConfirmArrivals /></WarehouseDashboardLayout>} />
            <Route path="/warehouse/inventory" element={<WarehouseDashboardLayout><LazyInventoryManagement /></WarehouseDashboardLayout>} />
            <Route path="/warehouse/reports" element={<WarehouseDashboardLayout><LazyMonthlyReport /></WarehouseDashboardLayout>} />
            <Route path="/warehouse/revenue" element={<WarehouseDashboardLayout><LazyMonthlyReport /></WarehouseDashboardLayout>} />
            <Route path="/warehouse/pickup" element={<WarehouseDashboardLayout><LazyConfirmPickup /></WarehouseDashboardLayout>} />
            <Route path="/warehouse/profile" element={<WarehouseDashboardLayout><LazyWarehouseProfile /></WarehouseDashboardLayout>} />
            
            {/* Delivery Partner Routes */}
            <Route path="/delivery/dashboard" element={<DeliveryPartnerDashboardLayout><LazyDeliveryPartnerDashboard /></DeliveryPartnerDashboardLayout>} />
            <Route path="/delivery/orders" element={<DeliveryPartnerDashboardLayout><LazyDeliveryOrderManagement /></DeliveryPartnerDashboardLayout>} />
            <Route path="/delivery/pickup" element={<DeliveryPartnerDashboardLayout><LazyPickupConfirmation /></DeliveryPartnerDashboardLayout>} />
            <Route path="/delivery/tracking" element={<DeliveryPartnerDashboardLayout><LazyDeliveryTracking /></DeliveryPartnerDashboardLayout>} />
            <Route path="/delivery/confirmation" element={<DeliveryPartnerDashboardLayout><LazyDeliveryConfirmation /></DeliveryPartnerDashboardLayout>} />
            <Route path="/delivery/profile" element={<DeliveryPartnerDashboardLayout><LazyDeliveryPartnerProfile /></DeliveryPartnerDashboardLayout>} />
            
            {/* Customer Routes */}
            <Route path="/customer/dashboard" element={<LazyCustomerDashboard />} />
            <Route path="/customer/checkout" element={<LazyCheckout />} />
            <Route path="/customer/order-confirmation" element={<LazyOrderConfirmation />} />
            <Route path="/customer/orders" element={<LazyCustomerOrders />} />
            <Route path="/customer/track-order/:orderId" element={<LazyCustomerOrderTracking />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboardLayout><LazyAdminDashboard /></AdminDashboardLayout>} />
            <Route path="/admin/users" element={<AdminDashboardLayout><LazyUserManagement /></AdminDashboardLayout>} />
            <Route path="/admin/warehouses" element={<AdminDashboardLayout><LazyWarehouseManagement /></AdminDashboardLayout>} />
            <Route path="/admin/orders" element={<AdminDashboardLayout><LazyAdminOrderManagement /></AdminDashboardLayout>} />
            <Route path="/admin/analytics" element={<AdminDashboardLayout><LazyAdminAnalytics /></AdminDashboardLayout>} />
            <Route path="/admin/marketing" element={<AdminDashboardLayout><LazyMarketingTools /></AdminDashboardLayout>} />
            <Route path="/admin/settings" element={<AdminDashboardLayout><LazySystemSettings /></AdminDashboardLayout>} />
            
            <Route path="/auth/role-selection" element={<RoleSelection />} />
            <Route path="/auth/register" element={<LazyRegistration />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/simple-login" element={<SimpleLogin />} />
            <Route path="/auth/verification" element={<LazyVerification />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </SmoothScrollProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
