import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  ArrowRight, 
  TrendingUp, 
  LayoutDashboard, 
  Database, 
  Users, 
  CheckCircle,
  Check
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = {
    basic: [
      "Up to 5 report categories",
      "Basic dashboard analytics",
      "Standard user management",
      "Email support",
      "Basic customization options"
    ],
    professional: [
      "Up to 15 report categories",
      "Advanced analytics dashboard",
      "Team collaboration features",
      "Priority email support",
      "Custom branding options",
      "Data export capabilities",
      "API access"
    ],
    enterprise: [
      "Unlimited report categories",
      "Enterprise-grade analytics",
      "Advanced team management",
      "24/7 dedicated support",
      "Custom integration options",
      "Advanced security features",
      "Custom deployment options",
      "SLA guarantees"
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-powerbi-dark to-powerbi-primary">
      <header className="container mx-auto p-6 flex justify-between items-center">
        <div className="text-white font-bold text-2xl flex items-center">
          <BarChart3 className="mr-2 h-8 w-8" />
          <span>Power BI Navigator</span>
        </div>
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-white hover:text-powerbi-primary"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
          <Button 
            className="bg-white text-powerbi-primary hover:bg-gray-100"
            onClick={() => navigate("/dashboard")}
          >
            View Demo
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 container mx-auto px-6 md:flex items-center justify-between gap-12">
          <div className="max-w-2xl text-white mb-12 md:mb-0 animate-fade-in">
            <h1 className="text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Unified Analytics Platform for Your Business
            </h1>
            <p className="text-xl mb-8 text-gray-100 leading-relaxed">
              Transform your Power BI experience with our intuitive dashboard platform. 
              Access all your reports in one place with powerful navigation, 
              customization, and user management.
            </p>
            <div className="flex gap-4">
              <Button 
                className="bg-white text-powerbi-primary hover:bg-gray-100"
                size="lg"
                onClick={() => navigate("/login")}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-powerbi-primary"
                size="lg"
                onClick={() => navigate("/dashboard")}
              >
                View Demo
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 shadow-xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/20 rounded-lg p-4 flex items-center">
                  <PieChart className="text-white mr-4 h-10 w-10" />
                  <div>
                    <div className="text-white font-bold">Sales Overview</div>
                    <div className="text-white/80 text-sm">+24% growth</div>
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 flex items-center">
                  <TrendingUp className="text-white mr-4 h-10 w-10" />
                  <div>
                    <div className="text-white font-bold">Performance</div>
                    <div className="text-white/80 text-sm">103 reports</div>
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 flex items-center">
                  <LineChart className="text-white mr-4 h-10 w-10" />
                  <div>
                    <div className="text-white font-bold">Forecasting</div>
                    <div className="text-white/80 text-sm">Q3 projections</div>
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 flex items-center">
                  <Database className="text-white mr-4 h-10 w-10" />
                  <div>
                    <div className="text-white font-bold">Data Warehouse</div>
                    <div className="text-white/80 text-sm">Connected</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 -bottom-4 -left-4 bg-gradient-to-br from-powerbi-primary to-powerbi-accent opacity-30 rounded-lg -z-10"></div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Simplify your reporting workflow with these powerful tools designed to enhance your Power BI experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 border rounded-lg">
                <div className="w-12 h-12 bg-powerbi-light flex items-center justify-center rounded-lg mb-4">
                  <LayoutDashboard className="text-powerbi-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Unified Dashboard</h3>
                <p className="text-gray-600">
                  Access all your Power BI reports from a single, customizable dashboard with intuitive navigation.
                </p>
              </div>
              
              <div className="p-6 border rounded-lg">
                <div className="w-12 h-12 bg-powerbi-light flex items-center justify-center rounded-lg mb-4">
                  <Users className="text-powerbi-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">User Management</h3>
                <p className="text-gray-600">
                  Manage user access with granular permissions and row-level security for each report.
                </p>
              </div>
              
              <div className="p-6 border rounded-lg">
                <div className="w-12 h-12 bg-powerbi-light flex items-center justify-center rounded-lg mb-4">
                  <TrendingUp className="text-powerbi-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Performance Analytics</h3>
                <p className="text-gray-600">
                  Track report usage and performance metrics to optimize your business intelligence.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-gray-50 to-white" id="pricing">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the perfect plan for your business needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:scale-105 transition-transform duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Basic</h3>
                  <p className="text-gray-600 mb-6">Perfect for small teams</p>
                  <div className="text-4xl font-bold mb-4">$29<span className="text-lg text-gray-500">/mo</span></div>
                </div>
                <ul className="space-y-4 mb-8">
                  {features.basic.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800"
                  onClick={() => navigate("/login")}
                >
                  Get Started
                </Button>
              </div>

              <div className="bg-gradient-to-b from-powerbi-primary to-powerbi-dark rounded-2xl shadow-xl p-8 border border-blue-100 transform hover:scale-105 transition-transform duration-300">
                <div className="text-center mb-8">
                  <div className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Professional</h3>
                  <p className="text-blue-100 mb-6">For growing businesses</p>
                  <div className="text-4xl font-bold mb-4 text-white">$99<span className="text-lg text-blue-200">/mo</span></div>
                </div>
                <ul className="space-y-4 mb-8">
                  {features.professional.map((feature, index) => (
                    <li key={index} className="flex items-center text-white">
                      <Check className="h-5 w-5 text-green-400 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-white text-powerbi-primary hover:bg-gray-100"
                  onClick={() => navigate("/login")}
                >
                  Start Free Trial
                </Button>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:scale-105 transition-transform duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                  <p className="text-gray-600 mb-6">For large organizations</p>
                  <div className="text-4xl font-bold mb-4">Custom</div>
                </div>
                <ul className="space-y-4 mb-8">
                  {features.enterprise.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                  onClick={() => navigate("/login")}
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Analytics Teams</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                See how our platform has transformed reporting workflows for these companies.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold text-xl">A</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Acme Corporation</h4>
                    <p className="text-sm text-gray-500">Financial Services</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "The Power BI Navigator has revolutionized how we access and share reports across the organization. The custom navigation and user permissions have been game-changers."
                </p>
                <div className="flex items-center">
                  <div className="text-amber-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <CheckCircle key={i} className="h-5 w-5" />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold text-xl">G</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Global Retail Partners</h4>
                    <p className="text-sm text-gray-500">Retail & E-commerce</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "We've been able to customize the platform to match our brand and create specialized navigation paths for different teams. The user management is exceptional."
                </p>
                <div className="flex items-center">
                  <div className="text-amber-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <CheckCircle key={i} className="h-5 w-5" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-powerbi-primary via-blue-600 to-powerbi-secondary py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to transform your reporting experience?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get started with Power BI Navigator today and unlock the full potential of your business intelligence.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                className="bg-white text-powerbi-primary hover:bg-gray-100"
                size="lg"
                onClick={() => navigate("/login")}
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-powerbi-primary"
                size="lg"
                onClick={() => navigate("/dashboard")}
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-powerbi-dark py-16 text-white/70">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center text-white font-bold text-xl mb-4">
                <BarChart3 className="mr-2 h-6 w-6" />
                <span>Power BI Navigator</span>
              </div>
              <p className="max-w-xs">
                Simplify your Power BI experience with our unified dashboard and reporting platform.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold mb-4 text-white">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                  <li><a href="#" className="hover:text-white">Case Studies</a></li>
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-white">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Team</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-white">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Privacy</a></li>
                  <li><a href="#" className="hover:text-white">Terms</a></li>
                  <li><a href="#" className="hover:text-white">Security</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8">
            <p className="text-center">© 2025 Power BI Navigator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
