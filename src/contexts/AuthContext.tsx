
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define user types and context types
export type UserRole = "admin" | "electrician";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  // In a real app, we would implement the register function
  // register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
}

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: "2",
    name: "John Electrician",
    email: "john@example.com",
    role: "electrician",
  },
  {
    id: "3",
    name: "Sarah Electrician",
    email: "sarah@example.com",
    role: "electrician",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Find user with matching email
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // In a real app, you would verify the password here
      // For this demo, we'll accept any password
      
      // Set user in state and localStorage
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      
      toast.success(`Welcome back, ${foundUser.name}!`);
      
      // Redirect based on role
      if (foundUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/electrician");
      }
    } catch (error) {
      toast.error("Login failed: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // In a real app, we would implement the register function
  /*
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    // Implementation would typically involve API calls to create a user in a database
    // For now, we're just showing a placeholder
  };
  */

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("You have been logged out");
    navigate("/");
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
