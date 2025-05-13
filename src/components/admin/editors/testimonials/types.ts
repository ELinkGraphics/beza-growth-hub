
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl?: string;
}

export interface TestimonialsContent {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

export const defaultTestimonialsContent: TestimonialsContent = {
  title: "Client Success Stories",
  subtitle: "Hear from clients who have transformed their lives and careers with our guidance.",
  testimonials: [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Marketing Director",
      quote: "Working with Beza has been transformative. I've gained clarity on my career goals and the confidence to pursue them.",
      avatarUrl: "/lovable-uploads/8ded2ada-1426-42c8-88e2-5c13060c5b5f.png"
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Entrepreneur",
      quote: "The personalized coaching sessions helped me overcome obstacles I'd been struggling with for years. I can't recommend Beza enough.",
      avatarUrl: "/lovable-uploads/8ded2ada-1426-42c8-88e2-5c13060c5b5f.png"
    },
    {
      id: "3",
      name: "Elena Rodriguez",
      role: "HR Manager",
      quote: "Beza's workshops provided our team with valuable insights and practical strategies that improved our collaboration and productivity.",
      avatarUrl: "/lovable-uploads/8ded2ada-1426-42c8-88e2-5c13060c5b5f.png"
    }
  ]
};
