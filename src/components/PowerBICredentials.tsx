
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const credentialsSchema = z.object({
  capacityId: z.string().min(1, "Capacity ID is required"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
  tenantId: z.string().min(1, "Tenant ID is required")
});

type CredentialsFormValues = z.infer<typeof credentialsSchema>;

const PowerBICredentials: React.FC = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);

  const form = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      capacityId: "",
      workspaceId: "",
      clientId: "",
      clientSecret: "",
      tenantId: ""
    }
  });

  const onSubmit = (values: CredentialsFormValues) => {
    // Here you would typically store credentials securely and establish a connection
    console.log("Power BI Credentials:", values);
    setIsConnected(true);
    
    toast({
      title: "Power BI credentials saved",
      description: "Your credentials have been securely saved and connection established."
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Power BI Connection</h2>
        {isConnected && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <span className="h-2 w-2 rounded-full bg-green-600 mr-2"></span>
            Connected
          </span>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Service Principal Authentication</CardTitle>
          <CardDescription>
            Enter your Power BI API connection details to enable report embedding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="capacityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter Power BI capacity ID" />
                      </FormControl>
                      <FormDescription>
                        Your Power BI Premium capacity ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="workspaceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workspace ID" />
                      </FormControl>
                      <FormDescription>
                        The ID of your Power BI workspace
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter app client ID" />
                      </FormControl>
                      <FormDescription>
                        App registration client ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="clientSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Secret</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="Enter client secret" />
                      </FormControl>
                      <FormDescription>
                        App registration client secret
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tenantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tenant ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter tenant ID" />
                      </FormControl>
                      <FormDescription>
                        Your Azure AD tenant ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-6">
                <Button type="submit">Save and Connect</Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t text-sm text-gray-500">
          These credentials are used for secure server-to-server communication with Power BI
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
          <CardDescription>
            Manage your Power BI service connection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Connection Status:</span>
              <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Last Refresh:</span>
              <span className="text-sm text-gray-600">
                {isConnected ? new Date().toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button variant="outline" type="button">
            Test Connection
          </Button>
          {isConnected && (
            <Button 
              variant="destructive" 
              type="button" 
              onClick={() => {
                setIsConnected(false);
                form.reset();
                toast({
                  title: "Connection reset",
                  description: "Power BI connection has been reset."
                });
              }}
            >
              Disconnect
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PowerBICredentials;
