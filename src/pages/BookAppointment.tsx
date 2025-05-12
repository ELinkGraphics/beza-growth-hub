
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BookAppointment = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Generate available times for the select
  const availableTimes = [
    "9:00 AM", "10:00 AM", "11:00 AM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];

  // We need to integrate Supabase for actual functionality
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // This is where we would connect to Supabase
    // For now, we'll just simulate a submission
    setTimeout(() => {
      toast({
        title: "Appointment request submitted!",
        description: "We'll confirm your appointment shortly via email.",
      });
      setIsSubmitting(false);
      setName("");
      setEmail("");
      setPhone("");
      setDate("");
      setTime("");
      setServiceType("");
      setMessage("");
    }, 1000);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-brand-50 py-20">
        <div className="container mx-auto section-padding text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Book an Appointment</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Take the first step on your growth journey by scheduling a session with Beza.
          </p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="section-padding py-16">
        <div className="container mx-auto max-w-3xl">
          <Card>
            <CardContent className="p-8">
              <div className="mb-6 flex items-start">
                <Calendar className="h-8 w-8 text-brand-500 mr-4 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Schedule Your Session</h2>
                  <p className="text-gray-600">
                    Please fill out the form below to request an appointment. All fields are required.
                  </p>
                </div>
              </div>
              
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
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time</Label>
                    <Select value={time} onValueChange={setTime} required>
                      <SelectTrigger id="time">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Service Type</Label>
                  <Select value={serviceType} onValueChange={setServiceType} required>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal-coaching">Personal Coaching</SelectItem>
                      <SelectItem value="career-development">Career Development</SelectItem>
                      <SelectItem value="group-workshop">Group Workshop</SelectItem>
                      <SelectItem value="initial-consultation">Initial Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Information</Label>
                  <Textarea
                    id="message"
                    placeholder="Please share any specific topics or questions you'd like to address during our session"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-500 hover:bg-brand-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Request Appointment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4">Important Information</h3>
            <div className="bg-gray-50 rounded-lg p-5 text-gray-700">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-brand-500 mr-2">•</span>
                  <span>Appointments are confirmed via email within 24 hours.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-500 mr-2">•</span>
                  <span>Please provide at least 24 hours notice for cancellations.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-500 mr-2">•</span>
                  <span>Sessions are available both in-person and virtually.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-500 mr-2">•</span>
                  <span>Initial consultations are 30 minutes and free of charge.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookAppointment;
