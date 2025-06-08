
import React, { useState } from "react";
import { useWebsiteContent } from "@/hooks/use-website-content";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Search, HelpCircle } from "lucide-react";

const FAQ = () => {
  const { content, loading, error } = useWebsiteContent("faq");
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const defaultContent = {
    hero: {
      title: "Frequently Asked Questions",
      description: "Find answers to common questions about our services and personal branding coaching."
    },
    categories: [
      {
        title: "General Questions",
        faqs: [
          {
            question: "What is personal branding coaching?",
            answer: "Personal branding coaching helps you identify, develop, and communicate your unique value proposition. We work together to build a strong, authentic personal brand that aligns with your career goals and helps you stand out in your industry."
          },
          {
            question: "Who can benefit from personal branding coaching?",
            answer: "Anyone looking to advance their career, change industries, build their professional reputation, or establish themselves as a thought leader can benefit from personal branding coaching. This includes executives, entrepreneurs, job seekers, and professionals at any career stage."
          },
          {
            question: "How long does the coaching process take?",
            answer: "The duration varies based on your goals and current situation. Typically, clients see significant progress within 3-6 months of consistent work. Some may need longer for comprehensive brand transformation, while others achieve their goals more quickly."
          }
        ]
      },
      {
        title: "Services & Pricing",
        faqs: [
          {
            question: "What services do you offer?",
            answer: "We offer one-on-one coaching sessions, group workshops, online courses, LinkedIn profile optimization, personal brand audits, and ongoing brand strategy consultation. Each service is designed to help you build and maintain a strong personal brand."
          },
          {
            question: "What are your coaching rates?",
            answer: "Our rates vary depending on the service and package you choose. We offer flexible options including single sessions, monthly packages, and comprehensive programs. Contact us for detailed pricing information tailored to your needs."
          },
          {
            question: "Do you offer payment plans?",
            answer: "Yes, we understand that investing in your personal brand is important, and we offer flexible payment options for most of our programs. We can discuss payment plans during your consultation."
          }
        ]
      },
      {
        title: "Getting Started",
        faqs: [
          {
            question: "How do I book a consultation?",
            answer: "You can book a free 30-minute consultation through our booking page. During this call, we'll discuss your goals, challenges, and determine the best approach for your personal branding journey."
          },
          {
            question: "What should I prepare for my first session?",
            answer: "Come with an open mind and clarity about your career goals. It's helpful to think about your strengths, values, and what you want to be known for. We'll guide you through the rest during our sessions."
          },
          {
            question: "Do you work with clients internationally?",
            answer: "Yes! We work with clients globally through virtual sessions. All coaching and consultations can be conducted online, making our services accessible regardless of your location."
          }
        ]
      }
    ]
  };

  const faqContent = content || defaultContent;

  const filteredFAQs = faqContent.categories.map((category: any) => ({
    ...category,
    faqs: category.faqs.filter((faq: any) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter((category: any) => category.faqs.length > 0);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="mb-6">
          <HelpCircle className="h-16 w-16 mx-auto text-brand-500 mb-4" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{faqContent.hero.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          {faqContent.hero.description}
        </p>
        
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container max-w-4xl mx-auto px-4 pb-16">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No FAQs found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredFAQs.map((category: any, categoryIndex: number) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{category.title}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq: any, faqIndex: number) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
                      className="bg-white rounded-lg shadow-sm border"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 bg-brand-500 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-lg mb-6 opacity-90">
            Can't find what you're looking for? We're here to help!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-white text-brand-500 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Contact Us
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
              Book Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
