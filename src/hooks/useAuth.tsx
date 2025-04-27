
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, fetchUserProfile, isAuthenticated as checkAuth, logout as signOut } from '@/utils/authUtils';

// Create a context for auth state
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
  refreshUser: async () => {},
});

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const refreshUser = async () => {
    if (checkAuth()) {
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };
  
  const logout = () => {
    signOut();
    setUser(null);
  };
  
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };
    
    initialize();
  }, []);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default useAuth;
