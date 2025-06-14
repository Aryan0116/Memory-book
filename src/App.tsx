
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateSlamBook from "./pages/CreateSlamBook";
import Dashboard from "./pages/Dashboard";
import SlamBookShare from "./pages/SlamBookShare";
import ViewResponses from "./pages/ViewResponses";
import Preview from "./pages/Preview";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import QRCodePage from "./pages/QRCodePage";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreateSlamBook />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/s/:id" element={<SlamBookShare />} />
          <Route path="/responses/:id" element={
            <ProtectedRoute>
              <ViewResponses />
            </ProtectedRoute>
          } />
          <Route path="/qr/:slug" element={
            <ProtectedRoute>
              <QRCodePage />
            </ProtectedRoute>
          } />
          <Route path="/preview" element={<Preview />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
