
import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useJobs, Job } from "../contexts/JobContext";
import { useAuth } from "../contexts/AuthContext";
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";

const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const { getAllJobs } = useJobs();
  const { getElectricianName } = useAuth();
  const jobs = getAllJobs();
  
  const handlePrint = () => {
    window.print();
  };
  
  const jobsByDate: { [key: string]: Job[] } = {};

  // Group jobs by date
  jobs.forEach(job => {
    if (!jobsByDate[job.date]) {
      jobsByDate[job.date] = [];
    }
    jobsByDate[job.date].push(job);
  });

  // Get current month's start and end date
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  
  // Get the start and end of the calendar display (including days from adjacent months)
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  // Get an array of all days to display
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const prevMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    setDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    setDate(newDate);
  };

  const getDayJobs = (day: Date) => {
    const dateString = format(day, "yyyy-MM-dd");
    return jobsByDate[dateString] || [];
  };

  return (
    <Card className="w-full print:shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 print:hidden">
        <CardTitle>Jobs Calendar</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(date, "MMMM yyyy")}
          </span>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handlePrint} 
            variant="outline" 
            size="sm" 
            className="ml-4"
          >
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* For print only - month header */}
        <div className="hidden print:block text-center p-4 text-xl font-bold">
          {format(date, "MMMM yyyy")} - PDX Electric Scheduling
        </div>
        
        <div className="grid grid-cols-7 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2 border-b font-medium text-sm">
              {day}
            </div>
          ))}
          
          {calendarDays.map((day, i) => {
            const dayJobs = getDayJobs(day);
            const isCurrentMonth = isSameMonth(day, date);
            const isCurrentDay = isToday(day);
            
            return (
              <div
                key={i}
                className={`min-h-[120px] border p-1 ${
                  !isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
                } ${isCurrentDay ? "bg-blue-50" : ""}`}
              >
                <div className="text-right p-1">
                  <span className={`text-sm font-medium ${isCurrentDay ? "h-6 w-6 rounded-full bg-primary text-white inline-flex items-center justify-center" : ""}`}>
                    {format(day, "d")}
                  </span>
                </div>
                <div className="space-y-1 mt-1 overflow-y-auto max-h-[80px]">
                  {dayJobs.map((job) => (
                    <div 
                      key={job.id} 
                      className="text-xs p-1 bg-primary/10 rounded truncate"
                      title={`${job.title} - ${getElectricianName(job.assignedToId)}`}
                    >
                      <div className="font-medium">{format(parseISO(`${job.date}T${job.startTime}`), "h:mm a")}</div>
                      <div className="truncate">{job.title}</div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {getElectricianName(job.assignedToId)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
