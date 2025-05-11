import { motion } from "framer-motion";
import ProgressChart from "../components/progress-chart";
import CountdownTimer from "../components/countdown-timer";

const Progress = () => {
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
        <h1 className="text-2xl font-bold text-[#E0E0E0]">Progress Tracking</h1>
      </motion.header>

      {/* Main Content */}
      <main className="px-5">
        {/* Tab Navigation */}
        <motion.div 
          className="flex border-b border-[#333333] mb-6"
          variants={itemVariants}
        >
          <button className="pb-2 px-4 font-medium text-[#AAAAAA]">
            Subjects
          </button>
          <button className="pb-2 px-4 font-medium text-[#AAAAAA]">
            Schedule
          </button>
          <button className="pb-2 px-4 font-medium text-[#FF5252] border-b-2 border-[#FF5252]">
            Progress
          </button>
        </motion.div>

        {/* Progress Charts */}
        <motion.div variants={itemVariants}>
          <ProgressChart />
        </motion.div>

        {/* Countdown Timer */}
        <motion.div 
          className="mt-6 mb-8"
          variants={itemVariants}
        >
          <CountdownTimer />
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Progress;
