
// User authentication utilities
import { toast } from "sonner";

// Type definition for User
export interface User {
  id: number;
  name: string;
  email: string;
  bio?: string;
  profilePicture?: string;
}

// Store token in local storage
export const setToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

// Get token from local storage
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Remove token from local storage
export const removeToken = () => {
  localStorage.removeItem('auth_token');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Get user data from token (decode JWT token if needed)
export const getUserFromToken = (): User | null => {
  const userData = localStorage.getItem('user_data');
  if (!userData) return null;
  try {
    return JSON.parse(userData);
  } catch (e) {
    return null;
  }
};

// Store user data
export const setUserData = (user: User) => {
  localStorage.setItem('user_data', JSON.stringify(user));
};

// Remove user data
export const removeUserData = () => {
  localStorage.removeItem('user_data');
};

// Headers with authorization token
export const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Login function
export const login = async (email: string, password: string): Promise<{user: User, token: string} | null> => {
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      toast.error(data.message || "Login failed");
      return null;
    }
    
    const data = await response.json();
    setToken(data.token);
    setUserData(data.user);
    toast.success("Login successful!");
    return data;
  } catch (error) {
    console.error("Error during login:", error);
    toast.error("Something went wrong during login");
    return null;
  }
};

// Register function
export const register = async (name: string, email: string, password: string): Promise<{user: User, token: string} | null> => {
  try {
    const response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      toast.error(data.message || "Registration failed");
      return null;
    }
    
    const data = await response.json();
    setToken(data.token);
    setUserData(data.user);
    toast.success("Registration successful!");
    return data;
  } catch (error) {
    console.error("Error during registration:", error);
    toast.error("Something went wrong during registration");
    return null;
  }
};

// Logout function
export const logout = () => {
  removeToken();
  removeUserData();
  toast.success("Logged out successfully!");
};

// Get user profile
export const fetchUserProfile = async (): Promise<User | null> => {
  try {
    const response = await fetch("http://localhost:3000/profile", {
      method: "GET",
      headers: authHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        removeToken();
        removeUserData();
        toast.error("Session expired. Please login again.");
      }
      return null;
    }
    
    const data = await response.json();
    setUserData(data.user);
    return data.user;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (profileData: FormData): Promise<User | null> => {
  try {
    const response = await fetch("http://localhost:3000/profile", {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${getToken()}`
        // Don't set Content-Type when sending FormData
      },
      body: profileData,
    });
    
    if (!response.ok) {
      const data = await response.json();
      toast.error(data.message || "Failed to update profile");
      return null;
    }
    
    const data = await response.json();
    setUserData(data.user);
    toast.success("Profile updated successfully!");
    return data.user;
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Something went wrong while updating profile");
    return null;
  }
};
