
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-powerbi-dark to-powerbi-primary">
      <header className="container mx-auto p-6 flex justify-between items-center">
        <div className="text-white font-bold text-2xl">Power BI Navigator</div>
        <Button 
          variant="outline" 
          className="text-white border-white hover:bg-white hover:text-powerbi-primary"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </header>

      <main className="flex-1 flex items-center justify-center container mx-auto px-6">
        <div className="max-w-3xl text-center text-white">
          <h1 className="text-5xl font-bold mb-6">
            Simplify Your Power BI Experience
          </h1>
          <p className="text-xl mb-8">
            Access and navigate all your Power BI reports in one place with our streamlined 
            dashboard and embedded viewer.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              className="bg-white text-powerbi-primary hover:bg-gray-100"
              size="lg"
              onClick={() => navigate("/login")}
            >
              Get Started
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
      </main>

      <footer className="container mx-auto p-6 text-white/70 text-center">
        <p>© 2025 Power BI Navigator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
