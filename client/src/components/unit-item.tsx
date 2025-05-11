import { useState } from "react";
import { motion } from "framer-motion";
import { Topic } from "../db/schema";
import { useApp } from "../context/app-context";
import { Badge } from "@/components/ui/badge";

interface UnitItemProps {
  topic: Topic;
}

const UnitItem = ({ topic }: UnitItemProps) => {
  const { updateTopic } = useApp();
  const [isCompleted, setIsCompleted] = useState(topic.completed);

  const toggleCompleted = async () => {
    const newCompletedState = !isCompleted;
    setIsCompleted(newCompletedState);
    await updateTopic(topic.id, { completed: newCompletedState });
  };

  // Animation variants
  const checkboxVariants = {
    checked: { 
      backgroundColor: "#FF5252", 
      borderColor: "#FF5252",
      transition: { duration: 0.2 } 
    },
    unchecked: { 
      backgroundColor: "rgba(0, 0, 0, 0)", 
      borderColor: "#444444",
      transition: { duration: 0.2 } 
    }
  };

  const checkmarkVariants = {
    checked: { 
      pathLength: 1,
      opacity: 1, 
      transition: { delay: 0.1, duration: 0.2 } 
    },
    unchecked: { 
      pathLength: 0,
      opacity: 0, 
      transition: { duration: 0.2 } 
    }
  };

  // Get a shortened description
  const shortDescription = topic.description.length > 80 
    ? `${topic.description.substring(0, 80)}...` 
    : topic.description;

  return (
    <motion.div
      className="flex items-start p-3 rounded-lg hover:bg-[#252525] transition-colors"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      <div className="mr-3 relative mt-0.5">
        <motion.div
          className="w-6 h-6 rounded-md border-2 flex items-center justify-center"
          variants={checkboxVariants}
          initial={isCompleted ? "checked" : "unchecked"}
          animate={isCompleted ? "checked" : "unchecked"}
          onClick={toggleCompleted}
        >
          <motion.svg
            width="12"
            height="10"
            viewBox="0 0 12 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M1 5L4 8L11 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={checkmarkVariants}
              initial={isCompleted ? "checked" : "unchecked"}
              animate={isCompleted ? "checked" : "unchecked"}
            />
          </motion.svg>
        </motion.div>
        <input
          type="checkbox"
          className="absolute opacity-0 inset-0 cursor-pointer"
          checked={isCompleted}
          onChange={toggleCompleted}
        />
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <motion.p
            className={`text-sm font-medium ${isCompleted ? "text-[#AAAAAA] line-through" : "text-[#E0E0E0]"}`}
            animate={{
              color: isCompleted ? "#AAAAAA" : "#E0E0E0",
            }}
            transition={{ duration: 0.2 }}
          >
            {topic.name}
          </motion.p>
          
          {topic.goalDate && (
            <Badge variant="outline" className="text-xs bg-transparent border-[#444444] text-[#AAAAAA]">
              Due: {new Date(topic.goalDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
            </Badge>
          )}
          
          {isCompleted && (
            <Badge className="text-xs bg-[#FF525220] text-[#FF5252] border-none">
              Completed
            </Badge>
          )}
        </div>
        
        <motion.p
          className={`text-xs ${isCompleted ? "text-[#777777] line-through" : "text-[#AAAAAA]"}`}
          animate={{
            color: isCompleted ? "#777777" : "#AAAAAA",
          }}
          transition={{ duration: 0.2 }}
        >
          {shortDescription}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default UnitItem;