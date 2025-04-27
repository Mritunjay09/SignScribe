
// User authentication utilities
import { toast } from "sonner";

// Type definition for User
export interface User {
  id: number;
  name: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  role: string;
}

// Store token in local storage
export const setToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

// Store refresh token in local storage
export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem('refresh_token', refreshToken);
};

// Get token from local storage
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Get refresh token from local storage
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

// Remove token from local storage
export const removeToken = () => {
  localStorage.removeItem('auth_token');
};

// Remove refresh token from local storage
export const removeRefreshToken = () => {
  localStorage.removeItem('refresh_token');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Check if user has specific role
export const hasRole = (role: string): boolean => {
  const userData = getUserFromToken();
  return userData?.role === role;
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

// Refresh access token
export const refreshAuthToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    return false;
  }
  
  try {
    const response = await fetch("http://localhost:3000/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (!response.ok) {
      removeToken();
      removeRefreshToken();
      removeUserData();
      return false;
    }
    
    const data = await response.json();
    setToken(data.token);
    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};

// Login function
export const login = async (email: string, password: string): Promise<{user: User, token: string, refreshToken: string} | null> => {
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      // Special handling for locked accounts
      if (response.status === 403 && data.message.includes('locked')) {
        toast.error(data.message);
      } else if (response.status === 401 && data.attemptsLeft) {
        toast.error(`${data.message}. You have ${data.attemptsLeft} attempt(s) left before your account is locked.`);
      } else {
        toast.error(data.message || "Login failed");
      }
      return null;
    }
    
    const data = await response.json();
    setToken(data.token);
    setRefreshToken(data.refreshToken);
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
export const register = async (name: string, email: string, password: string): Promise<{user: User, token: string, refreshToken: string} | null> => {
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
    setRefreshToken(data.refreshToken);
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
export const logout = async (): Promise<void> => {
  try {
    // Call logout endpoint to invalidate refresh token on server
    if (isAuthenticated()) {
      await fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: authHeaders(),
      });
    }
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    // Always clear local storage
    removeToken();
    removeRefreshToken();
    removeUserData();
    toast.success("Logged out successfully!");
  }
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
        // Try to refresh token
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          // Retry with new token
          return fetchUserProfile();
        }
        
        // Token expired or invalid and refresh failed
        removeToken();
        removeRefreshToken();
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
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          // Retry with new token
          return updateUserProfile(profileData);
        }
      }
      
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

// Request password reset
export const requestPasswordReset = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:3000/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      toast.error(data.message || "Failed to request password reset");
      return false;
    }
    
    const data = await response.json();
    toast.success(data.message || "Password reset instructions sent to your email");
    return true;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    toast.error("Something went wrong while requesting password reset");
    return false;
  }
};

// Reset password with token
export const resetPassword = async (token: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:3000/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      toast.error(data.message || "Failed to reset password");
      return false;
    }
    
    const data = await response.json();
    toast.success(data.message || "Password reset successful. You can now login.");
    return true;
  } catch (error) {
    console.error("Error resetting password:", error);
    toast.error("Something went wrong while resetting password");
    return false;
  }
};
