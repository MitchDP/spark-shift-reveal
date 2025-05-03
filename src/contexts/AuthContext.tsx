
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
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
}

// Initial mock users
const INITIAL_MOCK_USERS: User[] = [
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
  const [mockUsers, setMockUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  // Check for existing session and restore mockUsers on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load stored users or use initial mock users
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setMockUsers(JSON.parse(storedUsers));
    } else {
      setMockUsers(INITIAL_MOCK_USERS);
      localStorage.setItem("users", JSON.stringify(INITIAL_MOCK_USERS));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Find user with matching email
      const foundUser = mockUsers.find(u => u.email === email);
      
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

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if user with this email already exists
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error("A user with this email already exists");
      }
      
      // Create new user with unique ID
      const newUser: User = {
        id: Date.now().toString(), // Simple unique ID for demo
        name,
        email,
        role,
      };
      
      // Add to mock users array
      const updatedUsers = [...mockUsers, newUser];
      setMockUsers(updatedUsers);
      
      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Registration failed: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

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
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, register }}>
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
