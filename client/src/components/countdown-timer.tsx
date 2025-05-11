import { useApp } from "../context/app-context";
import { motion } from "framer-motion";

const CountdownTimer = () => {
  const { subjects } = useApp();

  // Sort subjects by exam date
  const sortedSubjects = [...subjects]
    .sort((a, b) => a.examDate.getTime() - b.examDate.getTime())
    .slice(0, 4); // Take the first 4 subjects

  // Calculate days remaining for each subject
  const subjectTimers = sortedSubjects.map(subject => {
    const now = new Date();
    const examDate = new Date(subject.examDate);
    const daysRemaining = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Extract course code or short name
    let shortName = subject.name.split(' ')[0]; // Default to first word
    const match = subject.name.match(/\(([^)]+)\)/); // Try to extract text in parentheses
    if (match) {
      shortName = match[1];
    }
    
    return {
      id: subject.id,
      daysRemaining,
      shortName
    };
  });

  return (
    <div className="bg-[#1E1E1E] rounded-xl p-4">
      <div className="flex items-center mb-3">
        <i className="ri-time-line text-[#FF5252] text-xl mr-2"></i>
        <h3 className="font-medium">Time Remaining</h3>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {subjectTimers.map((subject, index) => (
          <motion.div
            key={subject.id}
            className="text-center p-3 bg-[#333333] rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <motion.p 
              className="font-display font-bold text-xl text-[#FF5252]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 10,
                delay: index * 0.1 + 0.3
              }}
            >
              {subject.daysRemaining}
            </motion.p>
            <p className="text-xs">days</p>
            <p className="text-xs text-[#AAAAAA]">{subject.shortName}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
