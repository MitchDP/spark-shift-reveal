
import { useState } from "react";
import { format } from "date-fns";
import { Job } from "../contexts/JobContext";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../contexts/AuthContext";

interface JobCardProps {
  job: Job;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

const JobCard = ({ job, onEdit, onDelete, isAdmin = false }: JobCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { getElectricianName } = useAuth();
  
  const assignedToName = getElectricianName(job.assignedToId) || "Unassigned";
  
  const statusColors = {
    scheduled: "bg-purple-100 text-purple-800",
    "in-progress": "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <>
      <div 
        className="border p-4 rounded-lg shadow-sm hover:shadow transition-shadow bg-white cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(`${job.date}T${job.startTime}`), "h:mm a")} - 
              {format(new Date(`${job.date}T${job.endTime}`), "h:mm a")}
            </div>
            <h3 className="font-medium text-lg">{job.title}</h3>
            <div className="text-sm mt-1">
              {job.location}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className={statusColors[job.status]}>
              {job.status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
            </Badge>
            
            {isAdmin && (
              <div className="text-sm text-muted-foreground">
                {assignedToName}
              </div>
            )}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{job.description}</p>
        
        <div className="flex justify-end mt-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
          >
            View Details
          </Button>
        </div>
      </div>
      
      {/* Job Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{job.title}</DialogTitle>
            <DialogDescription>
              {format(new Date(job.date), "EEEE, MMMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <span className="text-sm font-medium">Time:</span>{" "}
                <span className="text-sm">
                  {format(new Date(`${job.date}T${job.startTime}`), "h:mm a")} - 
                  {format(new Date(`${job.date}T${job.endTime}`), "h:mm a")}
                </span>
              </div>
              
              <div>
                <Badge variant="outline" className={statusColors[job.status]}>
                  {job.status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </Badge>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Location:</h4>
              <p className="text-sm">{job.location}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Assigned To:</h4>
              <p className="text-sm">{assignedToName}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-1">Description:</h4>
              <p className="text-sm whitespace-pre-line">{job.description}</p>
            </div>
            
            {job.notes && (
              <div>
                <h4 className="text-sm font-medium mb-1">Notes:</h4>
                <p className="text-sm whitespace-pre-line">{job.notes}</p>
              </div>
            )}
            
            {isAdmin && (
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={onEdit}>
                  Edit
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Job</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this job? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobCard;
