import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Learn", href: "/learn" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
    { name: "Book", href: "/book" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 bg-background border-l border-border">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <Link 
              to="/" 
              className="text-xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent"
              onClick={() => setOpen(false)}
            >
              Grow with Beza
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <nav className="flex-1 py-8">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-lg font-medium text-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
          
          <div className="border-t border-border pt-6 pb-4">
            <div className="space-y-3">
              <Button size="lg" variant="gradient" className="w-full">
                <Link to="/book" onClick={() => setOpen(false)}>
                  Book Consultation
                </Link>
              </Button>
              <Button size="lg" variant="elegant" className="w-full">
                <Link to="/learn" onClick={() => setOpen(false)}>
                  Start Learning
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;