
import React from "react";
import { useWebsiteContent } from "@/hooks/use-website-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  const { content, loading, error } = useWebsiteContent("blog");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const defaultContent = {
    hero: {
      title: "Resources & Insights",
      description: "Discover valuable content to help you build your personal brand and grow your career."
    },
    categories: ["Personal Branding", "Career Development", "Leadership", "Networking"],
    posts: [
      {
        id: 1,
        title: "10 Essential Personal Branding Tips for 2024",
        excerpt: "Learn the key strategies to build a powerful personal brand that stands out in today's competitive market.",
        category: "Personal Branding",
        author: "Beza",
        date: "2024-01-15",
        readTime: "5 min read",
        featured: true
      },
      {
        id: 2,
        title: "How to Network Effectively as an Introvert",
        excerpt: "Networking doesn't have to be intimidating. Discover strategies that work for introverted professionals.",
        category: "Networking",
        author: "Beza",
        date: "2024-01-10",
        readTime: "7 min read",
        featured: false
      },
      {
        id: 3,
        title: "Building Leadership Skills Through Personal Development",
        excerpt: "Explore how personal growth directly impacts your ability to lead and inspire others.",
        category: "Leadership",
        author: "Beza",
        date: "2024-01-05",
        readTime: "6 min read",
        featured: false
      }
    ]
  };

  const blogContent = content || defaultContent;

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="container max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{blogContent.hero.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          {blogContent.hero.description}
        </p>
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {blogContent.categories.map((category: string) => (
            <Badge key={category} variant="outline" className="text-sm px-4 py-2">
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Featured Post */}
        {blogContent.posts.find((post: any) => post.featured) && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Featured Article</h2>
            {blogContent.posts
              .filter((post: any) => post.featured)
              .map((post: any) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-2/3 p-8">
                      <Badge className="mb-4">{post.category}</Badge>
                      <h3 className="text-3xl font-bold mb-4">{post.title}</h3>
                      <p className="text-gray-600 mb-6 text-lg">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                          <span>{post.readTime}</span>
                        </div>
                        <Button>
                          Read More <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                    <div className="md:w-1/3 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📚</div>
                        <p className="text-brand-700 font-medium">Featured Content</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}

        {/* Regular Posts */}
        <div>
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogContent.posts
              .filter((post: any) => !post.featured)
              .map((post: any) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center">
                    <div className="text-4xl">📖</div>
                  </div>
                  <CardHeader>
                    <Badge className="w-fit mb-2">{post.category}</Badge>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-brand-500 text-white rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Get the latest personal branding tips and career insights delivered to your inbox.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button variant="secondary" size="lg">
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
