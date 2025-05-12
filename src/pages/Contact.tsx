
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // We need to integrate Supabase for actual functionality
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // This is where we would connect to Supabase
    // For now, we'll just simulate a submission
    setTimeout(() => {
      toast({
        title: "Message sent successfully!",
        description: "Thanks for reaching out. We'll get back to you soon.",
      });
      setIsSubmitting(false);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1000);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-brand-50 py-20">
        <div className="container mx-auto section-padding text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Me</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Have questions or ready to start your journey? Reach out and I'll get back to you soon.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding py-16">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-bold mb-6">Send a Message</h2>
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="What's this about?"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Your message"
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-brand-500 hover:bg-brand-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:w-1/3">
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-brand-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-lg mb-1">Email</h3>
                      <a href="mailto:beza@growwithbeza.com" className="text-brand-600 hover:underline">
                        beza@growwithbeza.com
                      </a>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-brand-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-lg mb-1">Phone</h3>
                      <a href="tel:+12345678901" className="text-brand-600 hover:underline">
                        +1 (234) 567-8901
                      </a>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-brand-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-lg mb-1">Office</h3>
                      <p className="text-gray-700">
                        123 Growth Avenue<br />
                        San Francisco, CA 94107
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-3">Office Hours</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Monday - Friday</span>
                        <span>9:00 AM - 5:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Saturday</span>
                        <span>10:00 AM - 2:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Sunday</span>
                        <span>Closed</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
