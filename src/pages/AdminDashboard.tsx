
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useJobs, Job } from "../contexts/JobContext";
import { format, parseISO, isToday, isTomorrow, addDays } from "date-fns";
import JobCard from "../components/JobCard";
import JobForm from "../components/JobForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { getAllJobs, deleteJob } = useJobs();
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined);

  const allJobs = getAllJobs();

  // Group jobs by date
  const todayJobs = allJobs.filter((job) => isToday(parseISO(job.date)));
  const tomorrowJobs = allJobs.filter((job) => isTomorrow(parseISO(job.date)));
  const upcomingJobs = allJobs.filter(
    (job) => 
      !isToday(parseISO(job.date)) && 
      !isTomorrow(parseISO(job.date)) && 
      parseISO(job.date) >= new Date()
  );
  const pastJobs = allJobs.filter((job) => parseISO(job.date) < new Date() && !isToday(parseISO(job.date)));
  
  const handleAddJob = () => {
    setEditingJob(undefined);
    setIsJobFormOpen(true);
  };
  
  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsJobFormOpen(true);
  };
  
  const handleDeleteJob = (jobId: string) => {
    deleteJob(jobId);
  };

  // Helper function to render jobs for a specific date range
  const renderJobsList = (jobs: Job[], title: string) => {
    if (jobs.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          No jobs scheduled for {title.toLowerCase()}.
        </div>
      );
    }

    // Group jobs by date
    const jobsByDate: Record<string, Job[]> = {};
    
    jobs.forEach(job => {
      if (!jobsByDate[job.date]) {
        jobsByDate[job.date] = [];
      }
      jobsByDate[job.date].push(job);
    });
    
    // Sort dates
    const sortedDates = Object.keys(jobsByDate).sort();
    
    return (
      <>
        {sortedDates.map(date => (
          <div key={date} className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              {format(parseISO(date), "EEEE, MMMM d, yyyy")}
            </h3>
            <div className="space-y-3">
              {jobsByDate[date].map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onEdit={() => handleEditJob(job)}
                  onDelete={() => handleDeleteJob(job.id)}
                  isAdmin={true}
                />
              ))}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">ElectriSchedule</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:block">
              Welcome, {user?.name}
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <p className="text-muted-foreground">Manage all electrician schedules</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={handleAddJob}>
            Add New Job
          </Button>
        </div>

        <Separator className="my-6" />
        
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">
              Today 
              <span className="ml-2 text-xs bg-primary/10 rounded-full px-2 py-1">
                {todayJobs.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="tomorrow">
              Tomorrow
              <span className="ml-2 text-xs bg-primary/10 rounded-full px-2 py-1">
                {tomorrowJobs.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming
              <span className="ml-2 text-xs bg-primary/10 rounded-full px-2 py-1">
                {upcomingJobs.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4">
            {renderJobsList(todayJobs, "Today")}
          </TabsContent>
          
          <TabsContent value="tomorrow" className="space-y-4">
            {renderJobsList(tomorrowJobs, "Tomorrow")}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            {renderJobsList(upcomingJobs, "Upcoming Days")}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {renderJobsList(pastJobs, "Past Days")}
          </TabsContent>
        </Tabs>
      </main>
      
      <JobForm 
        isOpen={isJobFormOpen}
        onClose={() => setIsJobFormOpen(false)}
        editJob={editingJob}
      />
    </div>
  );
};

export default AdminDashboard;
