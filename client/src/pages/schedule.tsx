import { motion } from "framer-motion";
import ScheduleCalendar from "../components/schedule-calendar";
import StudySessionForm from "../components/study-session-form";
import { useApp } from "../context/app-context";
import { formatDate } from "../lib/date-utils";

const Schedule = () => {
  const { studySessions, subjects } = useApp();
  
  // Get the next upcoming session
  const upcomingSessions = [...studySessions]
    .filter(session => !session.completed && session.startTime > new Date())
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, 1);

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
      className="min-h-screen pt-6"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.header 
        className="px-5 mb-6 flex justify-between items-center"
        variants={itemVariants}
      >
        <h1 className="text-2xl font-bold text-[#E0E0E0]">Study Schedule</h1>
      </motion.header>

      {/* Main Content */}
      <main className="px-5">
        {/* Upcoming session alert */}
        {upcomingSessions.length > 0 && (
          <motion.div 
            className="mb-6 px-4 py-3 rounded-lg bg-[#1E1E1E] border-l-4 border-[#FF5252] flex items-start"
            variants={itemVariants}
          >
            <i className="ri-calendar-event-line text-[#FF5252] text-xl mr-3 mt-0.5"></i>
            <div>
              <h3 className="font-semibold text-sm">Upcoming Session</h3>
              <p className="text-sm text-[#AAAAAA]">
                {subjects.find(s => s.id === upcomingSessions[0].subjectId)?.name} - {formatDate(upcomingSessions[0].startTime)}
              </p>
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <motion.div 
          className="flex border-b border-[#333333] mb-6"
          variants={itemVariants}
        >
          <button className="pb-2 px-4 font-medium text-[#AAAAAA]">
            Subjects
          </button>
          <button className="pb-2 px-4 font-medium text-[#FF5252] border-b-2 border-[#FF5252]">
            Schedule
          </button>
          <button className="pb-2 px-4 font-medium text-[#AAAAAA]">
            Progress
          </button>
        </motion.div>

        {/* Calendar */}
        <motion.div variants={itemVariants}>
          <ScheduleCalendar />
        </motion.div>
      </main>
      
      {/* Add Study Session Button */}
      <StudySessionForm />
    </motion.div>
  );
};

export default Schedule;
