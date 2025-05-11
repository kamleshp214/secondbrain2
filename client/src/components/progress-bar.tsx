import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="h-2 bg-[#333333] rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-[#FF5252] to-[#D32F2F]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
      />
    </div>
  );
};

export default ProgressBar;
