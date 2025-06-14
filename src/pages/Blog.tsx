
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

const Blog = () => {
  const [posts] = useState<BlogPost[]>([
    {
      id: "1",
      title: "Building Your Personal Brand: A Complete Guide",
      excerpt: "Learn the fundamentals of creating a strong personal brand that sets you apart in your industry.",
      content: "Full article content here...",
      author: "Beza Coaching",
      date: "2024-06-10",
      category: "Personal Branding",
      readTime: "5 min read"
    },
    {
      id: "2",
      title: "Networking Strategies for Introverts",
      excerpt: "Discover effective networking techniques that work even if you're naturally introverted.",
      content: "Full article content here...",
      author: "Beza Coaching",
      date: "2024-06-08",
      category: "Networking",
      readTime: "7 min read"
    },
    {
      id: "3",
      title: "LinkedIn Optimization Tips",
      excerpt: "Maximize your LinkedIn profile to attract opportunities and build professional connections.",
      content: "Full article content here...",
      author: "Beza Coaching",
      date: "2024-06-05",
      category: "Social Media",
      readTime: "4 min read"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Blog & Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tips, and strategies to help you grow your personal brand and achieve your goals.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{post.category}</Badge>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Button variant="outline" className="w-full">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-brand-500 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6">Get the latest tips and insights delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded text-gray-800"
            />
            <Button className="bg-white text-brand-500 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
