
import { useAuth } from "../contexts/AuthContext";
import { useJobs } from "../contexts/JobContext";
import { format, parseISO } from "date-fns";
import JobCard from "../components/JobCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

const ElectricianDashboard = () => {
  const { user, logout } = useAuth();
  const { getJobsForToday } = useJobs();
  const [showJobs, setShowJobs] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Get today's jobs for the current electrician
  const todayJobs = user ? getJobsForToday(user.id) : [];
  
  // Sort jobs by start time
  const sortedJobs = [...todayJobs].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );
  
  // Check if it's morning (before 12 PM)
  const isMorning = currentTime.getHours() < 12;
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Function to format a job's time range
  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${format(parseISO(`2023-01-01T${startTime}`), "h:mm a")} - ${format(parseISO(`2023-01-01T${endTime}`), "h:mm a")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">ElectriSchedule</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:block">
              {user?.name}
            </span>
            <Button 
              variant="secondary"
              size="sm"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div>
          <h2 className="text-2xl font-bold">Today's Schedule</h2>
          <p className="text-muted-foreground">
            {format(currentTime, "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        <Separator className="my-6" />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Good {isMorning ? "Morning" : "Day"}, {user?.name.split(" ")[0]}</h3>
          
          {!showJobs && isMorning && todayJobs.length > 0 && (
            <div className="text-center py-6">
              <p className="mb-4">
                You have {todayJobs.length} job{todayJobs.length !== 1 ? "s" : ""} scheduled for today.
              </p>
              <Button 
                onClick={() => setShowJobs(true)}
                className="w-full md:w-auto"
              >
                View Today's Schedule
              </Button>
            </div>
          )}
          
          {(!isMorning || showJobs) && (
            <div className="space-y-4">
              {sortedJobs.length > 0 ? (
                sortedJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <p>You have no jobs scheduled for today.</p>
                  <p className="mt-2">Check back tomorrow morning for your next assignments.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {(!isMorning || showJobs) && todayJobs.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Schedule Summary</h3>
            <ul className="space-y-2">
              {sortedJobs.map(job => (
                <li key={job.id} className="flex justify-between">
                  <span className="font-medium">{job.title}</span>
                  <span className="text-muted-foreground">
                    {formatTimeRange(job.startTime, job.endTime)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default ElectricianDashboard;
