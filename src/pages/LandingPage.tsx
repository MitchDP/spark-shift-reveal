
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">ElectriSchedule</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate("/login")}
            className="bg-white text-primary hover:bg-white/90"
          >
            Login
          </Button>
        </div>
      </header>
      
      <main className="flex-1 bg-gray-50">
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Scheduling Made Simple for Electrical Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Streamline your operations with our specialized scheduling solution designed specifically for electricians and their managers.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="text-lg px-8 py-6 h-auto"
            >
              Get Started
            </Button>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">Simplified Scheduling</h4>
                <p className="text-gray-600">
                  Easily assign jobs to your team with detailed information about each task.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">Morning Reveal</h4>
                <p className="text-gray-600">
                  Electricians can view their daily schedule only in the morning, helping to focus on one day at a time.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">Role-Based Access</h4>
                <p className="text-gray-600">
                  Separate interfaces for administrators and electricians, with appropriate permissions for each.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">Ready to optimize your electrical service workflow?</h3>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join other electrical contractors who are increasing efficiency with ElectriSchedule.
            </p>
            <Button 
              variant="secondary"
              size="lg" 
              onClick={() => navigate("/login")}
              className="text-lg px-8 py-6 h-auto"
            >
              Get Started Now
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-white">ElectriSchedule</h2>
              <p className="text-sm">Scheduling for electrical professionals</p>
            </div>
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} ElectriSchedule. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
