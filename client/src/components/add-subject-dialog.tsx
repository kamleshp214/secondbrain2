import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "../context/app-context";
import { motion } from "framer-motion";

const AddSubjectDialog = () => {
  const { addSubject, addTopic } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [topicCount, setTopicCount] = useState(1);
  const [topics, setTopics] = useState([{ name: "", description: "" }]);

  // Reset form when dialog is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setOpen(open);
  };

  const resetForm = () => {
    setName("");
    setExamDate("");
    setTopicCount(1);
    setTopics([{ name: "", description: "" }]);
  };

  const handleTopicChange = (index: number, field: "name" | "description", value: string) => {
    const newTopics = [...topics];
    newTopics[index][field] = value;
    setTopics(newTopics);
  };

  const addTopicInput = () => {
    setTopics([...topics, { name: "", description: "" }]);
    setTopicCount(topicCount + 1);
  };

  const removeTopicInput = (index: number) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
    setTopicCount(topicCount - 1);
  };

  const handleSubmit = async () => {
    if (name && examDate) {
      // Create a new subject
      const subjectId = await addSubject({
        name,
        examDate: new Date(examDate)
      });

      // Add topics for the subject
      for (const topic of topics) {
        if (topic.name && topic.description) {
          await addTopic({
            subjectId,
            name: topic.name,
            description: topic.description,
            completed: false
          });
        }
      }

      // Close dialog and reset form
      setOpen(false);
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <motion.button
          className="w-full py-3 rounded-xl bg-[#FF5252] text-white font-semibold flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ boxShadow: "0 4px 12px rgba(255, 82, 82, 0.3)" }}
          whileTap={{ boxShadow: "0 2px 8px rgba(255, 82, 82, 0.2)" }}
        >
          <i className="ri-add-line mr-2"></i> Add New Subject
        </motion.button>
      </DialogTrigger>
      <DialogContent className="bg-[#1E1E1E] text-[#E0E0E0] border-[#333333] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#E0E0E0]">Add New Subject</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="subject-name">Subject Name</Label>
            <Input
              id="subject-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Machine Learning (CS-601)"
              className="bg-[#252525] border-[#333333] text-[#E0E0E0]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exam-date">Exam Date</Label>
            <Input
              id="exam-date"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="bg-[#252525] border-[#333333] text-[#E0E0E0]"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Topics</Label>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={addTopicInput}
                className="bg-[#252525] border-[#333333] text-[#E0E0E0] hover:bg-[#333333]"
              >
                <i className="ri-add-line mr-1"></i> Add Topic
              </Button>
            </div>

            {topics.map((topic, index) => (
              <motion.div 
                key={index} 
                className="space-y-2 p-3 border border-[#333333] rounded-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-start">
                  <Label htmlFor={`topic-name-${index}`}>Topic Name</Label>
                  {topicCount > 1 && (
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => removeTopicInput(index)}
                      className="h-6 w-6 p-0"
                    >
                      <i className="ri-close-line"></i>
                    </Button>
                  )}
                </div>
                <Input
                  id={`topic-name-${index}`}
                  value={topic.name}
                  onChange={(e) => handleTopicChange(index, "name", e.target.value)}
                  placeholder="e.g., UNIT-1"
                  className="bg-[#252525] border-[#333333] text-[#E0E0E0]"
                />
                <Label htmlFor={`topic-desc-${index}`}>Description</Label>
                <Input
                  id={`topic-desc-${index}`}
                  value={topic.description}
                  onChange={(e) => handleTopicChange(index, "description", e.target.value)}
                  placeholder="Topic description..."
                  className="bg-[#252525] border-[#333333] text-[#E0E0E0]"
                />
              </motion.div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="bg-[#252525] border-[#333333] text-[#E0E0E0] hover:bg-[#333333]"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            className="bg-[#FF5252] hover:bg-[#D32F2F] text-white"
          >
            Add Subject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectDialog;
