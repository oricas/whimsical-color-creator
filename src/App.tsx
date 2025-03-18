
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DrawingProvider } from "@/context/DrawingContext";
import { AnimatePresence } from "framer-motion";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import Components
import DrawingForm from "./components/DrawingForm";
import GeneratedOptions from "./components/GeneratedOptions";
import DrawingDetail from "./components/DrawingDetail";
import PrintSettings from "./components/PrintSettings";
import ColoredPreview from "./components/ColoredPreview";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DrawingProvider>
        <Toaster />
        <Sonner position="top-center" />
        <AnimatePresence mode="wait">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create" element={
                <Layout>
                  <DrawingForm />
                </Layout>
              } />
              <Route path="/create/options" element={
                <Layout>
                  <GeneratedOptions />
                </Layout>
              } />
              <Route path="/create/outlines" element={
                <Layout>
                  <DrawingDetail />
                </Layout>
              } />
              <Route path="/print" element={
                <Layout>
                  <PrintSettings />
                </Layout>
              } />
              <Route path="/preview" element={
                <Layout>
                  <ColoredPreview />
                </Layout>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AnimatePresence>
      </DrawingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
