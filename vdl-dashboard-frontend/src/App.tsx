import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WMSLayout } from "./components/Layout/WMSLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/LoginPage";
import SignUp from "./pages/auth/SignupPage";
import Orders from "./pages/Orders";
//import Shipping from "./pages/Shipping";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth routes (FULL PAGE, no WMSLayout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* WMS routes (with layout) */}
          <Route path="/" element={<WMSLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="inventory" element={<Inventory />} />
            <Route
              path="orders"
              element={ <Orders /> }
            />
            {/* <Route
              path="shipping"
              element={
               <Shipping />}
            /> */}
            <Route
              path="reports"
              element={
                <div className="p-8 text-center text-muted-foreground">
                  Reports module coming soon...
                </div>
              }
            />
            <Route
              path="users"
              element={
                <div className="p-8 text-center text-muted-foreground">
                  Users module coming soon...
                </div>
              }
            />
            <Route
              path="settings"
              element={
                <div className="p-8 text-center text-muted-foreground">
                  Settings module coming soon...
                </div>
              }
            />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
