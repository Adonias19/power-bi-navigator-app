
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PlusIcon, TrashIcon, UserPlus, Shield } from "lucide-react";

type Team = {
  id: string;
  name: string;
  members: User[];
  reportAccess: string[];
};

type User = {
  id: string;
  name: string;
  email: string;
};

const RLSSettings: React.FC = () => {
  const { toast } = useToast();
  
  // Demo data for teams and users
  const [teams, setTeams] = useState<Team[]>([
    { 
      id: "1", 
      name: "Executive Team", 
      members: [
        { id: "1", name: "John Smith", email: "john@example.com" }
      ], 
      reportAccess: ["nav1", "nav2"] 
    },
    { 
      id: "2", 
      name: "Marketing Team", 
      members: [
        { id: "2", name: "Jane Doe", email: "jane@example.com" }
      ], 
      reportAccess: ["nav2"] 
    },
    { 
      id: "3", 
      name: "Finance Team", 
      members: [
        { id: "3", name: "Robert Johnson", email: "robert@example.com" }
      ], 
      reportAccess: ["nav3"] 
    }
  ]);
  
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Smith", email: "john@example.com" },
    { id: "2", name: "Jane Doe", email: "jane@example.com" },
    { id: "3", name: "Robert Johnson", email: "robert@example.com" },
    { id: "4", name: "Sarah Wilson", email: "sarah@example.com" },
    { id: "5", name: "Michael Brown", email: "michael@example.com" }
  ]);
  
  const reportOptions = [
    { id: "nav1", name: "Sales Dashboard" },
    { id: "nav2", name: "Marketing Analysis" },
    { id: "nav3", name: "Financial Reports" },
    { id: "nav4", name: "Customer Insights" }
  ];
  
  const [newTeam, setNewTeam] = useState({
    name: "",
    reportAccess: [] as string[]
  });
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: ""
  });
  
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  
  const handleAddTeam = () => {
    if (newTeam.name) {
      const team: Team = {
        id: (teams.length + 1).toString(),
        name: newTeam.name,
        members: [],
        reportAccess: newTeam.reportAccess
      };
      
      setTeams([...teams, team]);
      setNewTeam({ name: "", reportAccess: [] });
      
      toast({
        title: "Team created",
        description: `${team.name} has been created successfully.`
      });
    }
  };
  
  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: (users.length + 1).toString(),
        name: newUser.name,
        email: newUser.email
      };
      
      setUsers([...users, user]);
      setNewUser({ name: "", email: "" });
      
      toast({
        title: "User added",
        description: `${user.name} has been added successfully.`
      });
    }
  };
  
  const handleAddUserToTeam = (teamId: string, userId: string) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        const userToAdd = users.find(u => u.id === userId);
        if (userToAdd && !team.members.some(m => m.id === userId)) {
          return {
            ...team,
            members: [...team.members, userToAdd]
          };
        }
      }
      return team;
    }));
    
    toast({
      title: "User added to team",
      description: "The user has been added to the team."
    });
  };
  
  const handleRemoveUserFromTeam = (teamId: string, userId: string) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: team.members.filter(m => m.id !== userId)
        };
      }
      return team;
    }));
    
    toast({
      title: "User removed from team",
      description: "The user has been removed from the team."
    });
  };
  
  const handleAddReportAccess = (teamId: string, reportId: string) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId && !team.reportAccess.includes(reportId)) {
        return {
          ...team,
          reportAccess: [...team.reportAccess, reportId]
        };
      }
      return team;
    }));
    
    toast({
      title: "Report access granted",
      description: "The team now has access to this report."
    });
  };
  
  const handleRemoveReportAccess = (teamId: string, reportId: string) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          reportAccess: team.reportAccess.filter(r => r !== reportId)
        };
      }
      return team;
    }));
    
    toast({
      title: "Report access removed",
      description: "The team no longer has access to this report."
    });
  };
  
  const handleDeleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
    
    toast({
      title: "Team deleted",
      description: "The team has been deleted successfully."
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="teams">
        <TabsList>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="access">Report Access</TabsTrigger>
        </TabsList>
        
        {/* Teams Tab */}
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end gap-4">
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="team-name">Team Name</Label>
                    <Input 
                      id="team-name" 
                      value={newTeam.name} 
                      onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                      placeholder="Enter team name"
                    />
                  </div>
                  <Button onClick={handleAddTeam} disabled={!newTeam.name}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Team
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Report Access</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.name}</TableCell>
                        <TableCell>{team.members.length} members</TableCell>
                        <TableCell>
                          {team.reportAccess.map(reportId => {
                            const report = reportOptions.find(r => r.id === reportId);
                            return report ? (
                              <span key={reportId} className="mr-2 inline-block bg-gray-100 px-2 py-1 rounded text-xs">
                                {report.name}
                              </span>
                            ) : null;
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedTeam(team)}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteTeam(team.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {selectedTeam && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Manage Team: {selectedTeam.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Team Members</h4>
                  <div className="flex items-end gap-4">
                    <div className="grid gap-2 flex-1">
                      <Label htmlFor="add-member">Add Member</Label>
                      <Select onValueChange={(userId) => handleAddUserToTeam(selectedTeam.id, userId)}>
                        <SelectTrigger id="add-member">
                          <SelectValue placeholder="Select a user to add" />
                        </SelectTrigger>
                        <SelectContent>
                          {users
                            .filter(user => !selectedTeam.members.some(m => m.id === user.id))
                            .map(user => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.email})
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTeam.members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveUserFromTeam(selectedTeam.id, member.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-medium">Report Access</h4>
                  <div className="flex items-end gap-4">
                    <div className="grid gap-2 flex-1">
                      <Label htmlFor="add-report">Add Report Access</Label>
                      <Select onValueChange={(reportId) => handleAddReportAccess(selectedTeam.id, reportId)}>
                        <SelectTrigger id="add-report">
                          <SelectValue placeholder="Select a report" />
                        </SelectTrigger>
                        <SelectContent>
                          {reportOptions
                            .filter(report => !selectedTeam.reportAccess.includes(report.id))
                            .map(report => (
                              <SelectItem key={report.id} value={report.id}>
                                {report.name}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTeam.reportAccess.map((reportId) => {
                        const report = reportOptions.find(r => r.id === reportId);
                        return report ? (
                          <TableRow key={reportId}>
                            <TableCell>{report.name}</TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveReportAccess(selectedTeam.id, reportId)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ) : null;
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTeam(null)}
                >
                  Close
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="user-name">Name</Label>
                    <Input 
                      id="user-name" 
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="Enter user name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input 
                      id="user-email" 
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="Enter user email"
                      type="email"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAddUser}
                  disabled={!newUser.name || !newUser.email}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add User
                </Button>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teams</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {teams
                            .filter(team => team.members.some(m => m.id === user.id))
                            .map(team => (
                              <span key={team.id} className="mr-2 inline-block bg-gray-100 px-2 py-1 rounded text-xs">
                                {team.name}
                              </span>
                            ))
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Access Tab */}
        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Report Access Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="report-select">Select Report</Label>
                  <Select onValueChange={setSelectedReport}>
                    <SelectTrigger id="report-select">
                      <SelectValue placeholder="Select a report" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportOptions.map(report => (
                        <SelectItem key={report.id} value={report.id}>
                          {report.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedReport && (
                  <div className="space-y-4 mt-4">
                    <h4 className="text-sm font-medium">Teams with access to this report</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Team Name</TableHead>
                          <TableHead>Members</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teams
                          .filter(team => team.reportAccess.includes(selectedReport))
                          .map(team => (
                            <TableRow key={team.id}>
                              <TableCell className="font-medium">{team.name}</TableCell>
                              <TableCell>
                                {team.members.map(member => (
                                  <div key={member.id} className="text-sm">
                                    {member.name} ({member.email})
                                  </div>
                                ))}
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RLSSettings;
