
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Link, PlusCircle, Unlink, BarChart } from "lucide-react";

interface PowerBICapacity {
  id: string;
  name: string;
  capacityId: string;
  workspaceId: string;
  clientId: string;
  assignedTo: string | null;
}

interface PowerBIReport {
  id: string;
  name: string;
  embedUrl: string;
  workspaceId: string;
}

interface Client {
  id: string;
  name: string;
}

const CapacitySettings: React.FC = () => {
  const { toast } = useToast();
  
  // Mock clients data
  const clients: Client[] = [
    { id: "1", name: "Acme Corporation" },
    { id: "2", name: "Globex Industries" }
  ];
  
  // Mock Power BI capacities
  const [capacities, setCapacities] = useState<PowerBICapacity[]>([
    {
      id: "1",
      name: "Marketing Analytics",
      capacityId: "ABC123",
      workspaceId: "WS001",
      clientId: "PBIAP001",
      assignedTo: "1"
    },
    {
      id: "2",
      name: "Financial Reports",
      capacityId: "DEF456",
      workspaceId: "WS002",
      clientId: "PBIAP002",
      assignedTo: null
    }
  ]);
  
  // Mock reports data
  const [reports, setReports] = useState<PowerBIReport[]>([
    {
      id: "r1",
      name: "Sales Dashboard",
      embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
      workspaceId: "WS001"
    },
    {
      id: "r2",
      name: "Marketing Analysis",
      embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
      workspaceId: "WS001"
    },
    {
      id: "r3",
      name: "Financial Reports",
      embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
      workspaceId: "WS002"
    },
    {
      id: "r4",
      name: "Customer Insights",
      embedUrl: "https://playground.powerbi.com/sampleReportEmbed",
      workspaceId: "WS002"
    }
  ]);
  
  const [isAddingCapacity, setIsAddingCapacity] = useState(false);
  const [editingCapacityId, setEditingCapacityId] = useState<string | null>(null);
  
  const [newCapacity, setNewCapacity] = useState<Omit<PowerBICapacity, 'id' | 'assignedTo'>>({
    name: "",
    capacityId: "",
    workspaceId: "",
    clientId: ""
  });

  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [activeCapacityId, setActiveCapacityId] = useState<string | null>("1");

  const handleAddCapacity = () => {
    if (!newCapacity.name || !newCapacity.capacityId || !newCapacity.workspaceId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const capacity: PowerBICapacity = {
      ...newCapacity,
      id: Date.now().toString(),
      assignedTo: null
    };
    
    setCapacities([...capacities, capacity]);
    setNewCapacity({
      name: "",
      capacityId: "",
      workspaceId: "",
      clientId: ""
    });
    setIsAddingCapacity(false);
    
    toast({
      title: "Capacity added",
      description: `${capacity.name} has been added successfully.`
    });
  };

  const handleEditCapacity = (capacity: PowerBICapacity) => {
    setNewCapacity({
      name: capacity.name,
      capacityId: capacity.capacityId,
      workspaceId: capacity.workspaceId,
      clientId: capacity.clientId
    });
    setEditingCapacityId(capacity.id);
    setIsAddingCapacity(true);
  };

  const handleUpdateCapacity = () => {
    if (!editingCapacityId) return;
    
    const updatedCapacities = capacities.map(capacity => {
      if (capacity.id === editingCapacityId) {
        return {
          ...capacity,
          name: newCapacity.name,
          capacityId: newCapacity.capacityId,
          workspaceId: newCapacity.workspaceId,
          clientId: newCapacity.clientId
        };
      }
      return capacity;
    });
    
    setCapacities(updatedCapacities);
    setNewCapacity({
      name: "",
      capacityId: "",
      workspaceId: "",
      clientId: ""
    });
    setEditingCapacityId(null);
    setIsAddingCapacity(false);
    
    toast({
      title: "Capacity updated",
      description: "Power BI capacity has been updated successfully."
    });
  };

  const handleCancelEdit = () => {
    setNewCapacity({
      name: "",
      capacityId: "",
      workspaceId: "",
      clientId: ""
    });
    setEditingCapacityId(null);
    setIsAddingCapacity(false);
  };

  const handleAssignToClient = (capacityId: string, clientId: string) => {
    const updatedCapacities = capacities.map(capacity => {
      if (capacity.id === capacityId) {
        return { ...capacity, assignedTo: clientId };
      }
      return capacity;
    });
    
    setCapacities(updatedCapacities);
    
    toast({
      title: "Capacity assigned",
      description: `Capacity has been assigned to ${clients.find(c => c.id === clientId)?.name || 'client'}.`
    });
  };

  const handleUnassignFromClient = (capacityId: string) => {
    const updatedCapacities = capacities.map(capacity => {
      if (capacity.id === capacityId) {
        return { ...capacity, assignedTo: null };
      }
      return capacity;
    });
    
    setCapacities(updatedCapacities);
    
    toast({
      title: "Capacity unassigned",
      description: "Capacity has been unassigned from the client."
    });
  };

  const filterReportsByWorkspace = (workspaceId: string) => {
    return reports.filter(report => report.workspaceId === workspaceId);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Database className="h-5 w-5 mr-2 text-powerbi-primary" />
          Power BI Capacity Management
        </h2>
        
        {!isAddingCapacity && (
          <Button onClick={() => setIsAddingCapacity(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Capacity
          </Button>
        )}
      </div>

      {isAddingCapacity && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingCapacityId ? "Edit Capacity" : "Add New Power BI Capacity"}</CardTitle>
            <CardDescription>
              Enter your Power BI capacity details for embedding reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity Name</label>
                <Input
                  value={newCapacity.name}
                  onChange={(e) => setNewCapacity({...newCapacity, name: e.target.value})}
                  placeholder="A descriptive name for this capacity"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity ID</label>
                <Input
                  value={newCapacity.capacityId}
                  onChange={(e) => setNewCapacity({...newCapacity, capacityId: e.target.value})}
                  placeholder="Your Power BI capacity ID"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Workspace ID</label>
                <Input
                  value={newCapacity.workspaceId}
                  onChange={(e) => setNewCapacity({...newCapacity, workspaceId: e.target.value})}
                  placeholder="Power BI workspace ID"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Client ID</label>
                <Input
                  value={newCapacity.clientId}
                  onChange={(e) => setNewCapacity({...newCapacity, clientId: e.target.value})}
                  placeholder="Service principal client ID"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={editingCapacityId ? handleUpdateCapacity : handleAddCapacity}>
                {editingCapacityId ? "Update Capacity" : "Add Capacity"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Capacities</CardTitle>
              <CardDescription>
                Manage your Power BI capacities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {capacities.map((capacity) => (
                  <div 
                    key={capacity.id}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${activeCapacityId === capacity.id ? 'bg-powerbi-light border-powerbi-primary' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                      setActiveCapacityId(capacity.id);
                      setSelectedWorkspace(capacity.workspaceId);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{capacity.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Workspace: {capacity.workspaceId}
                        </p>
                      </div>
                      
                      {capacity.assignedTo ? (
                        <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <span>Assigned</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                          <span>Unassigned</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          {activeCapacityId && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>
                      {capacities.find(c => c.id === activeCapacityId)?.name}
                    </CardTitle>
                    <CardDescription>
                      Details and assigned client
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditCapacity(capacities.find(c => c.id === activeCapacityId)!)}
                  >
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Capacity ID</h4>
                      <p>{capacities.find(c => c.id === activeCapacityId)?.capacityId}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Workspace ID</h4>
                      <p>{capacities.find(c => c.id === activeCapacityId)?.workspaceId}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Client ID</h4>
                      <p>{capacities.find(c => c.id === activeCapacityId)?.clientId}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Assigned To</h4>
                      <p>
                        {capacities.find(c => c.id === activeCapacityId)?.assignedTo 
                          ? clients.find(c => c.id === capacities.find(cap => cap.id === activeCapacityId)?.assignedTo)?.name 
                          : "Not assigned"}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Client Assignment</h4>
                    <div className="flex space-x-2">
                      {capacities.find(c => c.id === activeCapacityId)?.assignedTo ? (
                        <Button 
                          variant="outline" 
                          onClick={() => handleUnassignFromClient(activeCapacityId)}
                        >
                          <Unlink className="h-4 w-4 mr-2" />
                          Unassign from Client
                        </Button>
                      ) : (
                        <>
                          <select 
                            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            defaultValue=""
                            id="clientAssign"
                          >
                            <option value="" disabled>Select a client...</option>
                            {clients.map(client => (
                              <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                          </select>
                          <Button 
                            onClick={() => {
                              const select = document.getElementById('clientAssign') as HTMLSelectElement;
                              if (select.value) {
                                handleAssignToClient(activeCapacityId, select.value);
                              }
                            }}
                          >
                            <Link className="h-4 w-4 mr-2" />
                            Assign
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Available Reports</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedWorkspace && filterReportsByWorkspace(selectedWorkspace).map(report => (
                        <div 
                          key={report.id}
                          className="p-3 border rounded-md flex items-center space-x-2"
                        >
                          <BarChart className="h-4 w-4 text-powerbi-primary" />
                          <span className="text-sm">{report.name}</span>
                        </div>
                      ))}
                      
                      {selectedWorkspace && filterReportsByWorkspace(selectedWorkspace).length === 0 && (
                        <p className="text-sm text-muted-foreground col-span-2">
                          No reports found in this workspace.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CapacitySettings;
