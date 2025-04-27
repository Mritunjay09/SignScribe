
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  User, 
  fetchUserProfile, 
  isAuthenticated as checkAuth, 
  logout as signOut,
  refreshAuthToken,
  hasRole as checkRole
} from '@/utils/authUtils';

// Create a context for auth state
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: async () => {},
  refreshUser: async () => {},
  hasRole: () => false,
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
        // Try to refresh the token
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          // Try fetching user data again with the new token
          try {
            const userData = await fetchUserProfile();
            setUser(userData);
          } catch (secondError) {
            console.error('Failed to fetch user data after token refresh:', secondError);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    } else {
      setUser(null);
    }
  };
  
  const logout = async () => {
    await signOut();
    setUser(null);
  };
  
  const hasRole = (role: string) => {
    return checkRole(role);
  };
  
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };
    
    initialize();
    
    // Set up token refresh interval
    const refreshInterval = setInterval(async () => {
      if (checkAuth()) {
        await refreshAuthToken();
      }
    }, 10 * 60 * 1000); // Refresh token every 10 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        refreshUser,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default useAuth;
