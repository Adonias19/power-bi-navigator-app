
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Edit, Trash, UserPlus, Users } from "lucide-react";

interface Client {
  id: string;
  name: string;
  description: string;
  userLimit: number;
  currentUsers: number;
  contactPerson: string;
  email: string;
}

const ClientSettings: React.FC = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Acme Corporation",
      description: "Global technology and innovation company",
      userLimit: 50,
      currentUsers: 23,
      contactPerson: "John Smith",
      email: "john.smith@acme.com"
    },
    {
      id: "2",
      name: "Globex Industries",
      description: "Manufacturing and industrial solutions",
      userLimit: 25,
      currentUsers: 18,
      contactPerson: "Sarah Johnson",
      email: "sjohnson@globex.com"
    }
  ]);
  
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  
  const [newClient, setNewClient] = useState<Omit<Client, 'id' | 'currentUsers'>>({
    name: "",
    description: "",
    userLimit: 10,
    contactPerson: "",
    email: ""
  });

  const handleAddClient = () => {
    if (!newClient.name) {
      toast({
        title: "Client name required",
        description: "Please provide a name for the client.",
        variant: "destructive"
      });
      return;
    }
    
    const client: Client = {
      ...newClient,
      id: Date.now().toString(),
      currentUsers: 0
    };
    
    setClients([...clients, client]);
    setNewClient({
      name: "",
      description: "",
      userLimit: 10,
      contactPerson: "",
      email: ""
    });
    setIsAddingClient(false);
    
    toast({
      title: "Client added",
      description: `${client.name} has been added successfully.`
    });
  };

  const handleEditClient = (client: Client) => {
    setNewClient({
      name: client.name,
      description: client.description,
      userLimit: client.userLimit,
      contactPerson: client.contactPerson,
      email: client.email
    });
    setEditingClientId(client.id);
    setIsAddingClient(true);
  };

  const handleUpdateClient = () => {
    if (!editingClientId) return;
    
    const updatedClients = clients.map(client => {
      if (client.id === editingClientId) {
        return {
          ...client,
          name: newClient.name,
          description: newClient.description,
          userLimit: newClient.userLimit,
          contactPerson: newClient.contactPerson,
          email: newClient.email
        };
      }
      return client;
    });
    
    setClients(updatedClients);
    setNewClient({
      name: "",
      description: "",
      userLimit: 10,
      contactPerson: "",
      email: ""
    });
    setEditingClientId(null);
    setIsAddingClient(false);
    
    toast({
      title: "Client updated",
      description: "Client information has been updated successfully."
    });
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
    
    toast({
      title: "Client removed",
      description: "The client has been removed successfully."
    });
  };

  const handleCancelEdit = () => {
    setNewClient({
      name: "",
      description: "",
      userLimit: 10,
      contactPerson: "",
      email: ""
    });
    setEditingClientId(null);
    setIsAddingClient(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Building className="h-5 w-5 mr-2 text-powerbi-primary" />
          Client Management
        </h2>
        
        {!isAddingClient && (
          <Button onClick={() => setIsAddingClient(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Client
          </Button>
        )}
      </div>

      {isAddingClient && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingClientId ? "Edit Client" : "Add New Client"}</CardTitle>
            <CardDescription>
              {editingClientId 
                ? "Update client information and user limits" 
                : "Fill in the details to add a new client"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Client Name</label>
                <Input
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  placeholder="Enter client name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">User Limit</label>
                <Input
                  type="number"
                  min="1"
                  value={newClient.userLimit}
                  onChange={(e) => setNewClient({...newClient, userLimit: parseInt(e.target.value) || 0})}
                  placeholder="Maximum number of users"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Person</label>
                <Input
                  value={newClient.contactPerson}
                  onChange={(e) => setNewClient({...newClient, contactPerson: e.target.value})}
                  placeholder="Primary contact name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Email</label>
                <Input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  placeholder="Contact email address"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newClient.description}
                  onChange={(e) => setNewClient({...newClient, description: e.target.value})}
                  placeholder="Brief description of the client"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={editingClientId ? handleUpdateClient : handleAddClient}>
                {editingClientId ? "Update Client" : "Add Client"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {clients.map((client) => (
          <Card key={client.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{client.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {client.description}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditClient(client)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Users:</span>
                  <span className="font-medium">{client.currentUsers} / {client.userLimit}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-powerbi-primary"
                    style={{width: `${(client.currentUsers / client.userLimit) * 100}%`}}
                  ></div>
                </div>
                <div className="flex justify-between mt-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="ml-1">{client.contactPerson}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="ml-1">{client.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientSettings;
