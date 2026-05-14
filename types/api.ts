/*
================================
API Request Types
================================
*/

/*
================================
Login API Request
================================
*/

// Login API request body
export interface LoginRequest {
  email: string;
  password?: string;
}