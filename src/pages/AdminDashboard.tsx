
import React, { useState, useEffect } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, ArrowLeft, Book, User } from "lucide-react";
import { AppointmentsList } from "./AppointmentsList";
import { ContactsList } from "./ContactsList";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAuthenticated, setIsAuthenticated] = useState(true); // For demo purposes
  
  // Mock data for dashboard
  const stats = {
    totalAppointments: 12,
    pendingAppointments: 4,
    totalContacts: 8,
    newContacts: 3
  };
  
  useEffect(() => {
    // Here we would check authentication with Supabase
    // For demo purposes, we'll just use the state
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogout = () => {
    // Here we would sign out with Supabase
    setIsAuthenticated(false);
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto py-4 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-heading font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                Grow with Beza
              </span>
              <span className="bg-brand-100 text-brand-700 text-sm px-2 py-1 rounded">
                Admin
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Website</span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-brand-500 text-brand-600 hover:bg-brand-50"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto py-8 px-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-brand-500 mr-2" />
                <span className="text-3xl font-bold">{stats.totalAppointments}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Pending Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Book className="h-5 w-5 text-accent-500 mr-2" />
                <span className="text-3xl font-bold">{stats.pendingAppointments}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <User className="h-5 w-5 text-brand-500 mr-2" />
                <span className="text-3xl font-bold">{stats.totalContacts}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                New Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-accent-500 mr-2" />
                <span className="text-3xl font-bold">{stats.newContacts}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for different data */}
        <Tabs 
          defaultValue="appointments"
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="appointments" className="text-base">
              <Calendar className="h-4 w-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="contacts" className="text-base">
              <Mail className="h-4 w-4 mr-2" />
              Contact Messages
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointments">
            <AppointmentsList />
          </TabsContent>
          
          <TabsContent value="contacts">
            <ContactsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
