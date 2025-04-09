
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
}
