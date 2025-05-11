import { motion } from "framer-motion";
import { useApp } from "../context/app-context";
import SubjectCard from "../components/subject-card";
import AddSubjectDialog from "../components/add-subject-dialog";
import Reminders from "../components/reminders";

const Subjects = () => {
  const { subjects, loading } = useApp();

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

  return (
    <motion.div
      className="min-h-screen pt-6"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Header */}
      <header className="px-5 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#E0E0E0]">Second Brain</h1>
        <div className="flex items-center space-x-3">
          <motion.button
            className="p-2 rounded-full bg-[#333333] text-[#E0E0E0] hover:bg-[#FF5252] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="ri-search-line text-xl"></i>
          </motion.button>
          <motion.button
            className="p-2 rounded-full bg-[#333333] text-[#E0E0E0] hover:bg-[#FF5252] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="ri-settings-4-line text-xl"></i>
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5">
        {/* Reminders */}
        <Reminders />

        {/* Tab Navigation */}
        <div className="flex border-b border-[#333333] mb-6">
          <button className="pb-2 px-4 font-medium text-[#FF5252] border-b-2 border-[#FF5252]">
            Subjects
          </button>
          <button className="pb-2 px-4 font-medium text-[#AAAAAA]">
            Schedule
          </button>
          <button className="pb-2 px-4 font-medium text-[#AAAAAA]">
            Progress
          </button>
        </div>

        {/* Subject List */}
        <div className="space-y-4 mb-6">
          {loading ? (
            // Loading skeleton
            Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-xl bg-[#1E1E1E] animate-pulse"
                />
              ))
          ) : (
            // Actual subject cards
            subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))
          )}

          {/* Add Subject Button */}
          <AddSubjectDialog />
        </div>

        {/* Progress Summary Section */}
        <section className="mb-8">
          <h2 className="font-bold text-xl mb-4">Overall Progress</h2>

          <div className="bg-[#1E1E1E] rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Topics Completed</h3>
              <span className="font-semibold text-[#FF5252]">
                {subjects.reduce(
                  (total, subject) =>
                    total + useApp().getCompletedTopicsCount(subject.id),
                  0
                )}
                /
                {subjects.reduce(
                  (total, subject) =>
                    total + useApp().getTotalTopicsCount(subject.id),
                  0
                )}
              </span>
            </div>
            <div className="h-2 bg-[#333333] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF5252] to-[#D32F2F]"
                initial={{ width: "0%" }}
                animate={{
                  width: `${
                    subjects.reduce(
                      (total, subject) =>
                        total + useApp().getTotalTopicsCount(subject.id),
                      0
                    ) === 0
                      ? 0
                      : (subjects.reduce(
                          (total, subject) =>
                            total + useApp().getCompletedTopicsCount(subject.id),
                          0
                        ) /
                          subjects.reduce(
                            (total, subject) =>
                              total + useApp().getTotalTopicsCount(subject.id),
                            0
                          )) *
                        100
                  }%`,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-[#AAAAAA] mt-2">
              {subjects.reduce(
                (total, subject) =>
                  total + useApp().getTotalTopicsCount(subject.id),
                0
              ) === 0
                ? "0"
                : Math.round(
                    (subjects.reduce(
                      (total, subject) =>
                        total + useApp().getCompletedTopicsCount(subject.id),
                      0
                    ) /
                      subjects.reduce(
                        (total, subject) =>
                          total + useApp().getTotalTopicsCount(subject.id),
                        0
                      )) *
                      100
                  )}
              % of all topics completed
            </p>
          </div>
        </section>
      </main>
    </motion.div>
  );
};

export default Subjects;
