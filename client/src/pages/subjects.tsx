import { motion } from "framer-motion";
import { useApp } from "../context/app-context";
import { Link } from "wouter";
import SubjectCard from "../components/subject-card";
import AddSubjectDialog from "../components/add-subject-dialog";
import Reminders from "../components/reminders";
import CountdownTimer from "../components/countdown-timer";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

const Subjects = () => {
  const { subjects, topics, loading } = useApp();

  // Calculate total stats
  const totalUnits = subjects.reduce(
    (total, subject) => total + useApp().getTotalTopicsCount(subject.id),
    0
  );
  
  const completedUnits = subjects.reduce(
    (total, subject) => total + useApp().getCompletedTopicsCount(subject.id),
    0
  );
  
  const completionPercentage = totalUnits === 0 
    ? 0 
    : Math.round((completedUnits / totalUnits) * 100);

  // Find the closest exam
  const upcomingExams = [...subjects]
    .sort((a, b) => a.examDate.getTime() - b.examDate.getTime())
    .filter(subject => subject.examDate > new Date())
    .slice(0, 1);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
        className="bg-gradient-to-b from-[#1E1E1E] to-[#121212] py-4 sm:py-6 px-4 sm:px-5 mb-4 sm:mb-6"
        variants={itemVariants}
      >
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#E0E0E0]">Second Brain</h1>
            <p className="text-[#AAAAAA] text-sm mt-1">
              Your personal study companion
            </p>
          </div>
          <div className="flex flex-col items-end">
            <Badge variant="outline" className="bg-[#FF525220] text-[#FF5252] mb-1 border-[#FF5252]">
              {completionPercentage}% Complete
            </Badge>
            <p className="text-xs text-[#AAAAAA]">{completedUnits}/{totalUnits} units</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="px-3 sm:px-5">
        {/* Reminders */}
        <Reminders />
        
        {/* Closest Exam Alert */}
        {upcomingExams.length > 0 && (
          <motion.div 
            className="mb-6 p-4 rounded-xl bg-[#1E1E1E] border border-[#333333]"
            variants={itemVariants}
          >
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-[#FF525220] flex items-center justify-center mr-3">
                <i className="ri-alarm-warning-line text-[#FF5252] text-xl"></i>
              </div>
              <div>
                <h3 className="font-medium text-[#E0E0E0]">Upcoming Exam</h3>
                <p className="text-sm text-[#AAAAAA]">{upcomingExams[0].name}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[#FF5252] font-bold">{formatDistanceToNow(upcomingExams[0].examDate, { addSuffix: true })}</p>
                <p className="text-xs text-[#AAAAAA]">{upcomingExams[0].examDate.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="ml-13">
              <Link to="/schedule">
                <motion.button 
                  className="text-sm text-[#FF5252] flex items-center"
                  whileHover={{ x: 3 }}
                >
                  Plan your study sessions <i className="ri-arrow-right-line ml-1"></i>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Subject Header & Quick Stats */}
        <motion.div 
          className="flex justify-between items-center mb-4"
          variants={itemVariants}
        >
          <h2 className="text-xl font-bold flex items-center">
            <i className="ri-book-open-line text-[#FF5252] mr-2"></i> Subjects
          </h2>
          <div className="flex space-x-3 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#FF5252] mr-1"></div>
              <span className="text-[#AAAAAA]">{subjects.length} Subjects</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#666666] mr-1"></div>
              <span className="text-[#AAAAAA]">{topics.length} Units</span>
            </div>
          </div>
        </motion.div>

        {/* Subject List */}
        <motion.div 
          className="space-y-4 mb-8"
          variants={itemVariants}
        >
          {loading ? (
            // Loading skeleton
            Array(4)
              .fill(0)
              .map((_, i) => (
                <motion.div
                  key={i}
                  className="h-32 rounded-xl bg-[#1E1E1E] animate-pulse"
                  initial={{ opacity: 0.5, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                />
              ))
          ) : (
            // Actual subject cards
            subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                variants={itemVariants}
                custom={index}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <SubjectCard subject={subject} />
              </motion.div>
            ))
          )}

          {/* Add Subject Button */}
          <motion.div variants={itemVariants}>
            <AddSubjectDialog />
          </motion.div>
        </motion.div>

        {/* Time Countdown Section */}
        <motion.div variants={itemVariants}>
          <CountdownTimer />
        </motion.div>
        
        {/* Progress Summary Section */}
        <motion.section 
          className="mt-8 mb-8"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <i className="ri-bar-chart-line text-[#FF5252] mr-2"></i> Overall Progress
            </h2>
            <Link to="/progress">
              <motion.button 
                className="text-sm text-[#FF5252] flex items-center"
                whileHover={{ x: 3 }}
              >
                View details <i className="ri-arrow-right-line ml-1"></i>
              </motion.button>
            </Link>
          </div>

          <div className="bg-[#1E1E1E] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium text-[#E0E0E0]">Units Completed</h3>
                <p className="text-sm text-[#AAAAAA]">Your overall progress across all subjects</p>
              </div>
              <div className="text-right">
                <span className="font-semibold text-[#FF5252] text-2xl">
                  {completionPercentage}%
                </span>
              </div>
            </div>
            
            <div className="h-3 bg-[#333333] rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF5252] to-[#D32F2F]"
                initial={{ width: "0%" }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-[#AAAAAA]">
              <span>{completedUnits} completed</span>
              <span>{totalUnits - completedUnits} remaining</span>
            </div>
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
};

export default Subjects;
