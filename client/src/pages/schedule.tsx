import { motion } from "framer-motion";
import ScheduleCalendar from "../components/schedule-calendar";
import StudySessionForm from "../components/study-session-form";
import PomodoroTimer from "../components/pomodoro-timer";
import { useApp } from "../context/app-context";
import { formatDate } from "../lib/date-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

const Schedule = () => {
  const { studySessions, subjects } = useApp();
  
  // Get upcoming sessions
  const upcomingSessions = [...studySessions]
    .filter(session => !session.completed && session.startTime > new Date())
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, 3); // Show top 3 upcoming sessions

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
        <h1 className="text-2xl font-bold text-[#E0E0E0]">Your Study Schedule</h1>
        <p className="text-[#AAAAAA] text-sm mt-1">
          Plan your study sessions and track your time
        </p>
      </motion.div>

      {/* Main Content */}
      <main className="px-5">
        {/* Top section with upcoming sessions and timer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Sessions for today */}
          <motion.div 
            className="md:col-span-2 bg-[#1E1E1E] rounded-xl p-5 h-full"
            variants={itemVariants}
          >
            <div className="flex items-center mb-4">
              <i className="ri-calendar-check-line text-[#FF5252] text-xl mr-2"></i>
              <h2 className="text-lg font-bold">Today's Schedule</h2>
              <span className="ml-auto text-[#AAAAAA] text-sm">{format(new Date(), "MMM d, yyyy")}</span>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {todaySessions.length > 0 ? (
                todaySessions.map((session) => {
                  const subject = subjects.find(s => s.id === session.subjectId);
                  return (
                    <div 
                      key={session.id} 
                      className={`p-3 rounded-lg border-l-4 ${session.completed ? 'bg-[#252525] border-[#444444]' : 'bg-[#252525] border-[#FF5252]'} flex items-center`}
                    >
                      <div className="flex-1">
                        <h3 className={`font-medium ${session.completed ? 'text-[#AAAAAA] line-through' : 'text-[#E0E0E0]'}`}>
                          {subject?.name}
                        </h3>
                        <p className="text-xs text-[#AAAAAA]">
                          {format(new Date(session.startTime), "h:mm a")} - {format(new Date(session.endTime), "h:mm a")}
                        </p>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${session.completed ? 'bg-[#333333] text-[#AAAAAA]' : 'bg-[#FF525230] text-[#FF5252]'}`}>
                        {session.completed ? 'Completed' : 'Upcoming'}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-[#AAAAAA]">
                  <i className="ri-calendar-line text-4xl mb-2 block"></i>
                  <p>No sessions scheduled for today</p>
                  <p className="text-xs mt-1">Use the + button to add a study session</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Pomodoro Timer */}
          <motion.div 
            className="h-full"
            variants={itemVariants}
          >
            <PomodoroTimer />
          </motion.div>
        </div>

        {/* Calendar and session management section */}
        <motion.div 
          className="bg-[#1E1E1E] rounded-xl overflow-hidden mb-6"
          variants={itemVariants}
        >
          <Tabs defaultValue="calendar" className="w-full">
            <div className="px-5 pt-4 border-b border-[#333333]">
              <TabsList className="bg-[#252525]">
                <TabsTrigger value="calendar" className="data-[state=active]:bg-[#FF5252] data-[state=active]:text-white">
                  <i className="ri-calendar-line mr-2"></i> Calendar
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#FF5252] data-[state=active]:text-white">
                  <i className="ri-time-line mr-2"></i> Upcoming
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="calendar" className="p-0 mt-0">
              <div className="p-4">
                <ScheduleCalendar />
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming" className="p-0 mt-0">
              <div className="p-4">
                <h3 className="font-medium mb-3 text-[#E0E0E0]">Upcoming Study Sessions</h3>
                <div className="space-y-3">
                  {upcomingSessions.length > 0 ? (
                    upcomingSessions.map((session) => {
                      const subject = subjects.find(s => s.id === session.subjectId);
                      return (
                        <div 
                          key={session.id} 
                          className="p-4 rounded-lg bg-[#252525] border border-[#333333] flex items-center"
                        >
                          <div className="w-12 h-12 bg-[#333333] rounded-full flex items-center justify-center mr-4">
                            <i className="ri-book-open-line text-[#FF5252] text-xl"></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-[#E0E0E0]">{subject?.name}</h4>
                            <p className="text-sm text-[#AAAAAA]">{formatDate(session.startTime)}</p>
                          </div>
                          <div className="text-xs px-3 py-1 bg-[#FF525220] text-[#FF5252] rounded-full">
                            {format(new Date(session.startTime), "MMM d")}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 text-[#AAAAAA]">
                      <i className="ri-calendar-event-line text-4xl mb-2 block"></i>
                      <p>No upcoming sessions</p>
                      <p className="text-xs mt-1">Schedule a study session to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      {/* Add Study Session Button */}
      <StudySessionForm />
    </motion.div>
  );
};

export default Schedule;
