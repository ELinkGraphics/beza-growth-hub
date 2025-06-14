
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [faqs] = useState<FAQItem[]>([
    {
      id: "1",
      question: "What is personal branding coaching?",
      answer: "Personal branding coaching helps you develop and communicate your unique value proposition, build your professional reputation, and create a consistent image across all platforms and interactions.",
      category: "General"
    },
    {
      id: "2",
      question: "How long does the coaching process take?",
      answer: "The coaching process varies depending on your goals and current situation. Most clients see significant progress within 3-6 months, with ongoing refinement and growth continuing beyond that.",
      category: "Process"
    },
    {
      id: "3",
      question: "Do you offer group coaching sessions?",
      answer: "Yes, we offer both individual and group coaching sessions. Group sessions are great for networking and learning from others' experiences while being more cost-effective.",
      category: "Services"
    },
    {
      id: "4",
      question: "What's included in the course materials?",
      answer: "Course materials include video lessons, downloadable worksheets, templates, case studies, and access to our private community for ongoing support and networking.",
      category: "Courses"
    },
    {
      id: "5",
      question: "Can I get a refund if I'm not satisfied?",
      answer: "We offer a 30-day money-back guarantee for all our courses and coaching programs. If you're not completely satisfied, contact us for a full refund.",
      category: "Billing"
    },
    {
      id: "6",
      question: "How do I book a consultation?",
      answer: "You can book a free 30-minute consultation through our booking page. Simply select a time that works for you, and we'll send you a calendar invite with all the details.",
      category: "Booking"
    }
  ]);

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our coaching services and courses.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* FAQ Accordion */}
        <Card>
          <CardHeader>
            <CardTitle>Questions & Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center justify-between w-full mr-4">
                      <span>{faq.question}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {faq.category}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No FAQs found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-brand-500 hover:bg-brand-600">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline">
              Book Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
