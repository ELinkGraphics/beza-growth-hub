import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Learn from "./pages/Learn";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import BookAppointment from "./pages/BookAppointment";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import { LiveChat } from "./components/support/LiveChat";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main Website Routes */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Home />
                  <Footer />
                </>
              }
            />
            <Route
              path="/about"
              element={
                <>
                  <Navbar />
                  <About />
                  <Footer />
                </>
              }
            />
            <Route
              path="/learn"
              element={
                <>
                  <Navbar />
                  <Learn />
                  <Footer />
                </>
              }
            />
            <Route
              path="/services"
              element={
                <>
                  <Navbar />
                  <Services />
                  <Footer />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <Navbar />
                  <Contact />
                  <Footer />
                </>
              }
            />
            <Route
              path="/book"
              element={
                <>
                  <Navbar />
                  <BookAppointment />
                  <Footer />
                </>
              }
            />
            <Route
              path="/blog"
              element={
                <>
                  <Navbar />
                  <Blog />
                  <Footer />
                </>
              }
            />
            <Route
              path="/faq"
              element={
                <>
                  <Navbar />
                  <FAQ />
                  <Footer />
                </>
              }
            />

            {/* Authentication & Student Routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<StudentDashboard />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Live Chat available on all pages */}
          <LiveChat />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
