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
  email?: string;
  password?: string;
}

/*
================================
GET User API Response
================================
*/

// User情報
export interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

// GET User API response
export interface SingleUserResponse {
  data: UserData;
}