
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
