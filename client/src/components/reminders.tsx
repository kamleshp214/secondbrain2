import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useApp } from "../context/app-context";
import { formatDistanceToNow } from "date-fns";

interface Reminder {
  id: string;
  subject: string;
  message: string;
  urgent: boolean;
}

const Reminders = () => {
  const { subjects, topics } = useApp();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminders, setShowReminders] = useState(true);

  useEffect(() => {
    if (subjects.length === 0 || topics.length === 0) return;

    const urgentReminders: Reminder[] = [];

    // Sort subjects by exam date
    const sortedSubjects = [...subjects].sort((a, b) => 
      a.examDate.getTime() - b.examDate.getTime()
    );

    // Get the closest exam
    const nextExam = sortedSubjects[0];
    if (!nextExam) return;

    // Get days until next exam
    const daysUntilExam = Math.ceil((nextExam.examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate incomplete topics for this subject
    const subjectTopics = topics.filter(t => t.subjectId === nextExam.id);
    const incompleteTopic = subjectTopics.filter(t => !t.completed).length;

    if (daysUntilExam <= 14) {
      urgentReminders.push({
        id: `exam-${nextExam.id}`,
        subject: nextExam.name,
        message: `Your ${nextExam.name} exam is ${formatDistanceToNow(nextExam.examDate, { addSuffix: true })}. You have ${incompleteTopic} topics to complete.`,
        urgent: daysUntilExam <= 7
      });
    }

    setReminders(urgentReminders);
  }, [subjects, topics]);

  const dismissReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  return (
    <AnimatePresence>
      {showReminders && reminders.map(reminder => (
        <motion.div
          key={reminder.id}
          className="mb-6 px-4 py-3 rounded-lg bg-[#1E1E1E] border-l-4 border-[#FF5252] flex items-start"
          initial={{ opacity: 0, y: -50, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <i className="ri-alarm-warning-line text-[#FF5252] text-xl mr-3 mt-0.5"></i>
          <div>
            <h3 className="font-semibold text-sm">Study Reminder</h3>
            <p className="text-sm text-[#AAAAAA]">{reminder.message}</p>
          </div>
          <motion.button
            className="ml-auto p-1 text-[#AAAAAA]"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dismissReminder(reminder.id)}
          >
            <i className="ri-close-line"></i>
          </motion.button>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default Reminders;
