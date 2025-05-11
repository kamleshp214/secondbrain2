import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Subject, Topic } from "../db/schema";
import { formatDistanceToNow } from "date-fns";
import ProgressBar from "./progress-bar";
import UnitItem from "./unit-item";
import { useApp } from "../context/app-context";

interface SubjectCardProps {
  subject: Subject;
}

const SubjectCard = ({ subject }: SubjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getTopicsBySubject, getCompletedTopicsCount, getTotalTopicsCount } = useApp();

  const topics = getTopicsBySubject(subject.id);
  const completedCount = getCompletedTopicsCount(subject.id);
  const totalCount = getTotalTopicsCount(subject.id);
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Format the exam date
  const formattedExamDate = subject.examDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // Get the time remaining until the exam
  const timeUntilExam = formatDistanceToNow(subject.examDate, { addSuffix: true });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      layout
      className="rounded-xl bg-[#1E1E1E] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="font-bold text-lg">{subject.name}</h2>
            <p className="text-sm text-[#AAAAAA]">Exam: {formattedExamDate}</p>
            <p className="text-xs text-[#FF5252]">{timeUntilExam}</p>
          </div>
          <motion.button
            className="p-2 rounded-full hover:bg-[#333333] transition-colors"
            onClick={toggleExpand}
            whileTap={{ scale: 0.95 }}
          >
            <motion.i
              initial={false}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="ri-arrow-down-s-line text-xl"
            />
          </motion.button>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {completedCount}/{totalCount} units completed
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="bg-[#333333] px-4 py-3 space-y-3"
          >
            {topics.map((topic: Topic) => (
              <UnitItem key={topic.id} topic={topic} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SubjectCard;
