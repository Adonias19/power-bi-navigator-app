import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

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
  
  // Load teams and users from database on mount
  useEffect(() => {
    const fetchTeamsAndUsers = async () => {
      try {
        // Fetch teams
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('*');
        
        if (teamError) throw teamError;
        
        if (teamData && teamData.length > 0) {
          // Transform team data and load team members and access
          const transformedTeams = await Promise.all(teamData.map(async (team) => {
            // Get team members
            const { data: memberData, error: memberError } = await supabase
              .from('team_members')
              .select(`
                user_id,
                profiles:user_id (id, name, email)
              `)
              .eq('team_id', team.id);
            
            if (memberError) throw memberError;
            
            // Get team report access
            const { data: accessData, error: accessError } = await supabase
              .from('team_nav_access')
              .select('nav_item_id')
              .eq('team_id', team.id);
            
            if (accessError) throw accessError;
            
            // Transform members and access data
            const members = memberData?.map(member => ({
              id: member.profiles.id,
              name: member.profiles.name || member.profiles.email,
              email: member.profiles.email
            })) || [];
            
            const reportAccess = accessData?.map(access => access.nav_item_id) || [];
            
            return {
              id: team.id,
              name: team.name,
              members,
              reportAccess
            };
          }));
          
          setTeams(transformedTeams);
        }
        
        // Fetch users (from profiles table)
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id, name, email');
        
        if (userError) throw userError;
        
        if (userData && userData.length > 0) {
          const transformedUsers = userData.map(user => ({
            id: user.id,
            name: user.name || user.email,
            email: user.email
          }));
          
          setUsers(transformedUsers);
        }
        
      } catch (error) {
        console.error("Error fetching teams and users:", error);
        toast({
          title: "Error loading data",
          description: "There was an error loading teams and users.",
          variant: "destructive"
        });
      }
    };
    
    fetchTeamsAndUsers();
  }, [toast]);
  
  const reportOptions = [
    { id: "nav1", name: "Sales Dashboard" },
    { id: "nav2", name: "Marketing Analysis" },
    { id: "nav3", name: "Financial Reports" },
    { id: "nav4", name: "Customer Insights" }
  ];
  
  // Load report options from nav_items
  useEffect(() => {
    const fetchReportOptions = async () => {
      try {
        const { data, error } = await supabase
          .from('nav_items')
          .select('id, name');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // We'll implement this later
        }
      } catch (error) {
        console.error("Error fetching report options:", error);
      }
    };
    
    fetchReportOptions();
  }, []);
  
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
  
  const handleAddTeam = async () => {
    if (newTeam.name) {
      try {
        // Add to database
        const { data, error } = await supabase
          .from('teams')
          .insert({
            name: newTeam.name,
            description: `Team ${newTeam.name}`
          })
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          const team: Team = {
            id: data[0].id,
            name: data[0].name,
            members: [],
            reportAccess: []
          };
          
          setTeams([...teams, team]);
          setNewTeam({ name: "", reportAccess: [] });
          
          toast({
            title: "Team created",
            description: `${team.name} has been created successfully.`
          });
        }
      } catch (error) {
        console.error("Error creating team:", error);
        toast({
          title: "Error creating team",
          description: "There was an error saving to the database.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        // Check if user with this email already exists in auth
        const { data: existingUsers, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', newUser.email);
        
        if (checkError) throw checkError;
        
        let userId;
        
        if (existingUsers && existingUsers.length > 0) {
          // User exists, use their ID
          userId = existingUsers[0].id;
        } else {
          // Create new user in auth (this would typically be done through auth API)
          // For this example, we'll just add to profiles table
          const { data, error } = await supabase
            .from('profiles')
            .insert({
              email: newUser.email,
              name: newUser.name
            })
            .select();
          
          if (error) throw error;
          
          if (data && data[0]) {
            userId = data[0].id;
          }
        }
        
        if (userId) {
          const user: User = {
            id: userId,
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
      } catch (error) {
        console.error("Error adding user:", error);
        toast({
          title: "Error adding user",
          description: "There was an error saving to the database.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleAddUserToTeam = async (teamId: string, userId: string) => {
    try {
      // Add to database
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: userId
        });
      
      if (error) throw error;
      
      // Update state
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
    } catch (error) {
      console.error("Error adding user to team:", error);
      toast({
        title: "Error adding user to team",
        description: "There was an error saving to the database.",
        variant: "destructive"
      });
    }
  };
  
  const handleRemoveUserFromTeam = async (teamId: string, userId: string) => {
    try {
      // Remove from database
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Update state
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
    } catch (error) {
      console.error("Error removing user from team:", error);
      toast({
        title: "Error removing user from team",
        description: "There was an error updating the database.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddReportAccess = async (teamId: string, reportId: string) => {
    try {
      // Add to database
      const { error } = await supabase
        .from('team_nav_access')
        .insert({
          team_id: teamId,
          nav_item_id: reportId
        });
      
      if (error) throw error;
      
      // Update state
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
    } catch (error) {
      console.error("Error adding report access:", error);
      toast({
        title: "Error adding report access",
        description: "There was an error saving to the database.",
        variant: "destructive"
      });
    }
  };
  
  const handleRemoveReportAccess = async (teamId: string, reportId: string) => {
    try {
      // Remove from database
      const { error } = await supabase
        .from('team_nav_access')
        .delete()
        .eq('team_id', teamId)
        .eq('nav_item_id', reportId);
      
      if (error) throw error;
      
      // Update state
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
    } catch (error) {
      console.error("Error removing report access:", error);
      toast({
        title: "Error removing report access",
        description: "There was an error updating the database.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteTeam = async (teamId: string) => {
    try {
      // Delete team members first (foreign key constraint)
      const { error: membersError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId);
      
      if (membersError) throw membersError;
      
      // Delete team access records
      const { error: accessError } = await supabase
        .from('team_nav_access')
        .delete()
        .eq('team_id', teamId);
      
      if (accessError) throw accessError;
      
      // Delete the team
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);
      
      if (error) throw error;
      
      // Update state
      setTeams(prev => prev.filter(team => team.id !== teamId));
      
      toast({
        title: "Team deleted",
        description: "The team has been deleted successfully."
      });
    } catch (error) {
      console.error("Error deleting team:", error);
      toast({
        title: "Error deleting team",
        description: "There was an error deleting from the database.",
        variant: "destructive"
      });
    }
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
