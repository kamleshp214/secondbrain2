import { motion } from "framer-motion";
import PomodoroTimer from "../components/pomodoro-timer";
import FocusEnvironment from "../components/focus-environment";
import { useApp } from "../context/app-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const Schedule = () => {
  const { studySessions, subjects } = useApp();
  
  // Get today's sessions
  const today = new Date();
  const todaySessions = [...studySessions]
    .filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate.getDate() === today.getDate() && 
             sessionDate.getMonth() === today.getMonth() && 
             sessionDate.getFullYear() === today.getFullYear();
    })
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  // Get weekly stats
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Set to start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6); // End of week (Saturday)
  weekEnd.setHours(23, 59, 59, 999);
  
  const weekSessions = studySessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    return sessionDate >= weekStart && sessionDate <= weekEnd;
  });
  
  // Calculate total study time this week in minutes
  const totalStudyTime = weekSessions.reduce((total, session) => {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    return total + durationMinutes;
  }, 0);
  
  // Count completed sessions
  const completedSessions = weekSessions.filter(session => session.completed).length;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  return (
    <motion.div
      className="min-h-screen pb-24"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Header with gradient */}
      <motion.div 
        className="bg-gradient-to-b from-[#1E1E1E] to-[#121212] py-6 px-5 mb-6"
        variants={itemVariants}
      >
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#E0E0E0]">Study Focus</h1>
            <p className="text-[#AAAAAA] text-sm mt-1">
              Track your progress and stay focused
            </p>
          </div>
          
          {/* Weekly stats */}
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="flex flex-col items-center">
                <Badge variant="outline" className="mb-1 bg-[#FF525215] text-[#FF5252] border-[#FF5252]">
                  <i className="ri-time-line mr-1"></i> {Math.round(totalStudyTime)} min
                </Badge>
                <span className="text-xs text-[#AAAAAA]">This Week</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex flex-col items-center">
                <Badge variant="outline" className="mb-1 bg-[#FF525215] text-[#FF5252] border-[#FF5252]">
                  <i className="ri-check-line mr-1"></i> {completedSessions}
                </Badge>
                <span className="text-xs text-[#AAAAAA]">Sessions</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="px-5">
        {/* Tab Navigation */}
        <motion.div variants={itemVariants} className="mb-6">
          <Tabs defaultValue="focus" className="w-full">
            <TabsList className="bg-[#1E1E1E] p-1 w-full border border-[#333333] rounded-lg">
              <TabsTrigger 
                value="focus" 
                className="flex-1 data-[state=active]:bg-[#FF5252] data-[state=active]:text-white"
              >
                <i className="ri-mental-health-line mr-2"></i> Focus Environment
              </TabsTrigger>
              <TabsTrigger 
                value="timer" 
                className="flex-1 data-[state=active]:bg-[#FF5252] data-[state=active]:text-white"
              >
                <i className="ri-timer-line mr-2"></i> Pomodoro Timer
              </TabsTrigger>
              <TabsTrigger 
                value="today" 
                className="flex-1 data-[state=active]:bg-[#FF5252] data-[state=active]:text-white"
              >
                <i className="ri-calendar-check-line mr-2"></i> Today's Sessions
              </TabsTrigger>
            </TabsList>

            {/* Focus Environment Tab */}
            <TabsContent value="focus" className="mt-6">
              <FocusEnvironment />
            </TabsContent>

            {/* Pomodoro Timer Tab */}
            <TabsContent value="timer" className="mt-6">
              <motion.div 
                className="max-w-md mx-auto"
                variants={itemVariants}
              >
                <PomodoroTimer />
              </motion.div>
            </TabsContent>

            {/* Today's Sessions Tab */}
            <TabsContent value="today" className="mt-6">
              <motion.div variants={itemVariants} className="bg-[#1E1E1E] rounded-xl p-5">
                <div className="flex items-center mb-4">
                  <h2 className="text-lg font-bold">Today's Study Schedule</h2>
                  <span className="ml-auto text-[#AAAAAA] text-sm">{format(new Date(), "MMM d, yyyy")}</span>
                </div>
                
                <div className="space-y-3">
                  {todaySessions.length > 0 ? (
                    todaySessions.map((session) => {
                      const subject = subjects.find(s => s.id === session.subjectId);
                      const startTime = new Date(session.startTime);
                      const endTime = new Date(session.endTime);
                      
                      // Calculate duration in minutes
                      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
                      
                      return (
                        <motion.div 
                          key={session.id} 
                          className="bg-[#252525] rounded-lg overflow-hidden"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center border-l-4 border-[#FF5252] pl-3 pr-4 py-3">
                            <div className="flex-1">
                              <div className="flex items-center flex-wrap gap-2">
                                <h3 className={`font-medium ${session.completed ? 'text-[#AAAAAA]' : 'text-[#E0E0E0]'}`}>
                                  {subject?.name}
                                </h3>
                                <Badge className={`text-xs ${session.completed ? 'bg-[#333333] text-[#AAAAAA]' : 'bg-[#FF525220] text-[#FF5252]'}`}>
                                  {session.completed ? 'Completed' : 'Upcoming'}
                                </Badge>
                              </div>
                              <div className="flex items-center text-xs text-[#AAAAAA] mt-1">
                                <div className="flex items-center mr-3">
                                  <i className="ri-time-line mr-1"></i>
                                  {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                                </div>
                                <div className="flex items-center">
                                  <i className="ri-timer-line mr-1"></i>
                                  {durationMinutes} min
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-[#AAAAAA]">
                              {session.completed ? (
                                <i className="ri-checkbox-circle-fill text-xl text-[#FF5252]"></i>
                              ) : (
                                <div className="text-sm font-medium">
                                  {format(startTime, "h:mm")}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 text-[#AAAAAA]">
                      <i className="ri-calendar-line text-4xl mb-2 block"></i>
                      <p>No sessions scheduled for today</p>
                      <p className="text-xs mt-1">Start a focus session to track your study time</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Schedule;
