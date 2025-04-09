
import React from "react";
import LoginForm from "@/components/LoginForm";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-powerbi-primary">Power BI Navigator</h1>
          <p className="text-gray-600 mt-2">Access all your Power BI reports in one place</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
