import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Subjects from "@/pages/subjects";
import Schedule from "@/pages/schedule";
import Progress from "@/pages/progress";
import Settings from "@/pages/settings";
import NavigationBar from "@/components/navigation-bar";
import { AppProvider } from "./context/app-context";
import { AnimatePresence } from "framer-motion";

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        <Route path="/" component={Subjects} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/progress" component={Progress} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <div className="bg-neural min-h-screen pb-20">
            <Toaster />
            <Router />
            <NavigationBar />
          </div>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
