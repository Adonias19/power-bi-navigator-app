
import React from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserSettings from "@/components/UserSettings";
import NavigationSettings from "@/components/NavigationSettings";
import RLSSettings from "@/components/RLSSettings";
import ThemeSettings from "@/components/ThemeSettings";
import ClientSettings from "@/components/ClientSettings";
import CapacitySettings from "@/components/CapacitySettings";

const Settings: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-powerbi-primary">Settings</h1>
        
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="user">User Profile</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="capacities">Power BI Capacities</TabsTrigger>
            <TabsTrigger value="rls">Row Level Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user">
            <UserSettings />
          </TabsContent>
          
          <TabsContent value="theme">
            <ThemeSettings />
          </TabsContent>
          
          <TabsContent value="navigation">
            <NavigationSettings />
          </TabsContent>
          
          <TabsContent value="clients">
            <ClientSettings />
          </TabsContent>
          
          <TabsContent value="capacities">
            <CapacitySettings />
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
