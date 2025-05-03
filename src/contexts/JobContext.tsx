
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { User } from "./AuthContext";

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  assignedToId: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  notes?: string;
}

interface JobContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  addJob: (job: Omit<Job, "id">) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  getJobById: (id: string) => Job | undefined;
  getJobsForToday: (userId: string) => Job[];
  getJobsForUser: (userId: string) => Job[];
  getAllJobs: () => Job[];
  clearSampleJobs: () => void;
}

// Generate sample data for the app
const generateSampleJobs = (): Job[] => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  return [];
};

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load jobs from localStorage or use sample data
    const loadJobs = () => {
      try {
        const savedJobs = localStorage.getItem("jobs");
        if (savedJobs) {
          setJobs(JSON.parse(savedJobs));
        } else {
          // Initialize with sample data
          const sampleJobs = generateSampleJobs();
          setJobs(sampleJobs);
          localStorage.setItem("jobs", JSON.stringify(sampleJobs));
        }
      } catch (err) {
        setError("Failed to load jobs data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Save jobs to localStorage whenever they change
  useEffect(() => {
    if (jobs.length > 0 && !loading) {
      localStorage.setItem("jobs", JSON.stringify(jobs));
    }
  }, [jobs, loading]);

  const addJob = (job: Omit<Job, "id">) => {
    const newJob: Job = {
      ...job,
      id: Date.now().toString(), // Simple ID generation
    };
    
    setJobs((prevJobs) => [...prevJobs, newJob]);
    toast.success("Job added successfully");
  };

  const updateJob = (updatedJob: Job) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
    toast.success("Job updated successfully");
  };

  const deleteJob = (id: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    toast.success("Job deleted");
  };

  const getJobById = (id: string) => {
    return jobs.find((job) => job.id === id);
  };

  const getJobsForToday = (userId: string) => {
    const today = new Date().toISOString().split("T")[0];
    return jobs.filter(
      (job) => job.assignedToId === userId && job.date === today
    );
  };

  const getJobsForUser = (userId: string) => {
    return jobs.filter((job) => job.assignedToId === userId);
  };

  const getAllJobs = () => {
    return [...jobs].sort((a, b) => {
      // Sort by date first
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      // Then sort by start time
      return a.startTime.localeCompare(b.startTime);
    });
  };

  const clearSampleJobs = () => {
    setJobs([]);
    localStorage.setItem("jobs", JSON.stringify([]));
    toast.success("All sample jobs have been cleared");
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        loading,
        error,
        addJob,
        updateJob,
        deleteJob,
        getJobById,
        getJobsForToday,
        getJobsForUser,
        getAllJobs,
        clearSampleJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};
