
import React from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserSettings from "@/components/UserSettings";
import NavigationSettings from "@/components/NavigationSettings";
import PowerBICredentials from "@/components/PowerBICredentials";
import RLSSettings from "@/components/RLSSettings";

const Settings: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-powerbi-primary">Settings</h1>
        
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="user">User Profile</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="credentials">Power BI Credentials</TabsTrigger>
            <TabsTrigger value="rls">Row Level Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user">
            <UserSettings />
          </TabsContent>
          
          <TabsContent value="navigation">
            <NavigationSettings />
          </TabsContent>
          
          <TabsContent value="credentials">
            <PowerBICredentials />
          </TabsContent>
          
          <TabsContent value="rls">
            <RLSSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
