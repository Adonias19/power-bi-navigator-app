
export interface Report {
  id: string;
  name: string;
  embedUrl: string;
  thumbnail?: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  organization?: string;
  lastLogin?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: boolean;
  defaultView?: string;
}

export interface PowerBICredentials {
  capacityId: string;
  workspaceId: string;
  clientId: string;
  clientSecret: string;
  tenantId: string;
  isConnected?: boolean;
  lastRefresh?: string;
}

export interface Client {
  id: string;
  name: string;
  description: string;
  userLimit: number;
  currentUsers: number;
  contactPerson: string;
  email: string;
}

export interface PowerBICapacity {
  id: string;
  name: string;
  capacityId: string;
  workspaceId: string;
  clientId: string;
  assignedTo: string | null;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderRadius: number;
  font: string;
  darkMode: boolean;
  logo: string | null;
}

export interface NavigationCategory {
  id: string;
  name: string;
  icon: string;
  items: NavigationItem[];
  order: number;
}

export interface NavigationItem {
  id: string;
  name: string;
  path: string;
  icon: string;
  embedUrl: string;
  categoryId: string;
  order: number;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: string[]; // User IDs
  navigationAccess: string[]; // Navigation Item IDs
}
