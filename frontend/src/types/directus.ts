// This file contains Directus-generated types
// Auto-generated - do not edit manually
// Run `npm run schema:fetch` to regenerate

export interface DirectusUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  password: string;
  location: string | null;
  title: string | null;
  description: string | null;
  avatar: string | null;
  language: string | null;
  theme: string | null;
  tfa_secret: string | null;
  status: string;
  role: string | null;
  token: string | null;
  last_access: string | null;
  last_page: string | null;
  provider: string;
  external_identifier: string | null;
  auth_data: any | null;
  email_notifications: boolean | null;
  date_created: string;
  date_updated: string;
}

// This will be replaced by the schema generator
export interface DirectusSchema {
  // Collections will be populated by schema:fetch
  [key: string]: any;
}