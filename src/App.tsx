
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BookAppointment from "./pages/BookAppointment";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AppointmentsList from "./pages/AppointmentsList";
import ContactsList from "./pages/ContactsList";
import Auth from "./pages/Auth";
import Learn from "./pages/Learn";
import StudentDashboard from "./pages/StudentDashboard";
import CourseViewer from "./pages/CourseViewer";
import { CourseDetailPage } from "./components/course/CourseDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/appointments" element={<AppointmentsList />} />
            <Route path="/admin/contacts" element={<ContactsList />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/course/:courseId" element={<CourseDetailPage />} />
            <Route path="/course-viewer/:courseId" element={<CourseViewer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
