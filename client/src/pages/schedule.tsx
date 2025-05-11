import { motion } from "framer-motion";
import PomodoroTimer from "../components/pomodoro-timer";
import FocusEnvironment from "../components/focus-environment";
import { useApp } from "../context/app-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

// Define interfaces for TypeScript
interface StudySession {
  id: string;
  startTime: string | Date;
  endTime: string | Date;
  subjectId: string;
  completed: boolean;
}

interface Subject {
  id: string;
  name: string;
}

interface AppContext {
  studySessions: StudySession[];
  subjects: Subject[];
}

const Schedule = () => {
  const { studySessions, subjects } = useApp() as AppContext;

  // Get today's sessions
  const today = new Date();
  const todaySessions = [...studySessions]
    .filter((session) => {
      const sessionDate = new Date(session.startTime);
      return (
        sessionDate.getDate() === today.getDate() &&
        sessionDate.getMonth() === today.getMonth() &&
        sessionDate.getFullYear() === today.getFullYear()
      );
    })
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  // Get weekly stats
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const weekSessions = studySessions.filter((session) => {
    const sessionDate = new Date(session.startTime);
    return sessionDate >= weekStart && sessionDate <= weekEnd;
  });

  const totalStudyTime = weekSessions.reduce((total, session) => {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    return total + durationMinutes;
  }, 0);

  const completedSessions = weekSessions.filter(
    (session) => session.completed
  ).length;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  return (
    <motion.div
      className="min-h-screen pb-16 sm:pb-24 bg-[#121212]"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Header with gradient */}
      <motion.div
        className="bg-gradient-to-b from-[#1E1E1E] to-[#121212] py-4 sm:py-6 px-3 sm:px-5 mb-3 sm:mb-6"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-[#E0E0E0]">
              Study Focus
            </h1>
            <p className="text-[#AAAAAA] text-[0.65rem] sm:text-sm mt-0.5 sm:mt-1">
              Track your progress and stay focused
            </p>
          </div>

          {/* Weekly stats */}
          <div className="flex space-x-2 sm:space-x-4">
            <div className="text-center">
              <div className="flex flex-col items-center">
                <Badge
                  variant="outline"
                  className="mb-0.5 sm:mb-1 bg-[#FF525215] text-[#FF5252] border-[#FF5252] text-[0.65rem] sm:text-sm py-0.5 sm:py-1 px-1.5 sm:px-2"
                >
                  <i className="ri-time-line mr-0.5 sm:mr-1 text-[0.75rem] sm:text-base"></i>{" "}
                  {Math.round(totalStudyTime)} min
                </Badge>
                <span className="text-[0.6rem] sm:text-xs text-[#AAAAAA]">
                  This Week
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="flex flex-col items-center">
                <Badge
                  variant="outline"
                  className="mb-0.5 sm:mb-1 bg-[#FF525215] text-[#FF5252] border-[#FF5252] text-[0.65rem] sm:text-sm py-0.5 sm:py-1 px-1.5 sm:px-2"
                >
                  <i className="ri-check-line mr-0.5 sm:mr-1 text-[0.75rem] sm:text-base"></i>{" "}
                  {completedSessions}
                </Badge>
                <span className="text-[0.6rem] sm:text-xs text-[#AAAAAA]">
                  Sessions
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="px-3 sm:px-5">
        {/* Tab Navigation */}
        <motion.div variants={itemVariants} className="mb-3 sm:mb-6">
          <Tabs defaultValue="focus" className="w-full">
            <TabsList className="bg-[#1E1E1E] p-0.5 w-full border border-[#333333] rounded-lg flex overflow-x-auto">
              <TabsTrigger
                value="focus"
                className="flex-1 text-[0.65rem] sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 data-[state=active]:bg-[#FF5252] data-[state=active]:text-white whitespace-nowrap"
              >
                <i className="ri-mental-health-line mr-1 sm:mr-2 text-[0.75rem] sm:text-base"></i>
                <span className="hidden sm:inline">Focus Environment</span>
                <span className="sm:hidden">Focus</span>
              </TabsTrigger>
              <TabsTrigger
                value="timer"
                className="flex-1 text-[0.65rem] sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 data-[state=active]:bg-[#FF5252] data-[state=active]:text-white whitespace-nowrap"
              >
                <i className="ri-timer-line mr-1 sm:mr-2 text-[0.75rem] sm:text-base"></i>
                <span className="hidden sm:inline">Pomodoro Timer</span>
                <span className="sm:hidden">Timer</span>
              </TabsTrigger>
              <TabsTrigger
                value="today"
                className="flex-1 text-[0.65rem] sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 data-[state=active]:bg-[#FF5252] data-[state=active]:text-white whitespace-nowrap"
              >
                <i className="ri-calendar-check-line mr-1 sm:mr-2 text-[0.75rem] sm:text-base"></i>
                <span className="hidden sm:inline">Today's Sessions</span>
                <span className="sm:hidden">Today</span>
              </TabsTrigger>
            </TabsList>

            {/* Focus Environment Tab */}
            <TabsContent value="focus" className="mt-3 sm:mt-6">
              <FocusEnvironment />
            </TabsContent>

            {/* Pomodoro Timer Tab */}
            <TabsContent value="timer" className="mt-3 sm:mt-6">
              <motion.div className="max-w-md mx-auto" variants={itemVariants}>
                <PomodoroTimer />
              </motion.div>
            </TabsContent>

            {/* Today's Sessions Tab */}
            <TabsContent value="today" className="mt-3 sm:mt-6">
              <motion.div
                variants={itemVariants}
                className="bg-[#1E1E1E] rounded-xl p-3 sm:p-5"
              >
                <div className="flex items-center mb-2 sm:mb-4">
                  <h2 className="text-sm sm:text-lg font-bold text-[#E0E0E0]">
                    Today's Study Schedule
                  </h2>
                  <span className="ml-auto text-[#AAAAAA] text-[0.65rem] sm:text-sm">
                    {format(new Date(), "MMM d, yyyy")}
                  </span>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {todaySessions.length > 0 ? (
                    todaySessions.map((session) => {
                      const subject = subjects.find(
                        (s) => s.id === session.subjectId
                      );
                      const startTime = new Date(session.startTime);
                      const endTime = new Date(session.endTime);
                      const durationMinutes = Math.round(
                        (endTime.getTime() - startTime.getTime()) / (1000 * 60)
                      );

                      return (
                        <motion.div
                          key={session.id}
                          className="bg-[#252525] rounded-lg overflow-hidden"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center border-l-4 border-[#FF5252] pl-2 sm:pl-3 pr-2 sm:pr-4 py-2 sm:py-3">
                            <div className="flex-1">
                              <div className="flex items-center flex-wrap gap-1 sm:gap-2">
                                <h3
                                  className={`font-medium text-[0.75rem] sm:text-base ${
                                    session.completed
                                      ? "text-[#AAAAAA]"
                                      : "text-[#E0E0E0]"
                                  }`}
                                >
                                  {subject?.name || "Unknown Subject"}
                                </h3>
                                <Badge
                                  className={`text-[0.6rem] sm:text-xs py-0.5 sm:py-1 px-1 sm:px-1.5 ${
                                    session.completed
                                      ? "bg-[#333333] text-[#AAAAAA]"
                                      : "bg-[#FF525220] text-[#FF5252]"
                                  }`}
                                >
                                  {session.completed ? "Completed" : "Upcoming"}
                                </Badge>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center text-[0.6rem] sm:text-xs text-[#AAAAAA] mt-0.5 sm:mt-1 gap-0.5 sm:gap-3">
                                <div className="flex items-center">
                                  <i className="ri-time-line mr-0.5 sm:mr-1 text-[0.75rem] sm:text-base"></i>
                                  {format(startTime, "h:mm a")} -{" "}
                                  {format(endTime, "h:mm a")}
                                </div>
                                <div className="flex items-center">
                                  <i className="ri-timer-line mr-0.5 sm:mr-1 text-[0.75rem] sm:text-base"></i>
                                  {durationMinutes} min
                                </div>
                              </div>
                            </div>

                            <div className="text-[#AAAAAA] ml-1 sm:ml-2">
                              {session.completed ? (
                                <i className="ri-checkbox-circle-fill text-base sm:text-xl text-[#FF5252]"></i>
                              ) : (
                                <div className="text-[0.65rem] sm:text-sm font-medium">
                                  {format(startTime, "h:mm")}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 sm:py-10 text-[#AAAAAA]">
                      <i className="ri-calendar-line text-3xl sm:text-4xl mb-1 sm:mb-2 block"></i>
                      <p className="text-[0.75rem] sm:text-base">
                        No sessions scheduled for today
                      </p>
                      <p className="text-[0.6rem] sm:text-xs mt-0.5 sm:mt-1">
                        Start a focus session to track your study time
                      </p>
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
