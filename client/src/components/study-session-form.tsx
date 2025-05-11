import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "../context/app-context";
import { motion } from "framer-motion";

const StudySessionForm = () => {
  const { subjects, topics, addStudySession } = useApp();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: "",
    topicId: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  // Get topics for the selected subject
  const subjectTopics = topics.filter(
    (topic) => topic.subjectId === formData.subjectId
  );

  const resetForm = () => {
    setFormData({
      subjectId: "",
      topicId: "",
      date: "",
      startTime: "",
      endTime: "",
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setOpen(open);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
      // Reset topic if subject changes
      ...(field === "subjectId" ? { topicId: "" } : {}),
    });
  };

  const handleSubmit = async () => {
    const { date, startTime, endTime, subjectId, topicId } = formData;
    
    if (!date || !startTime || !endTime || !subjectId) return;
    
    // Create start and end dates
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);
    
    // Validate times
    if (endDateTime <= startDateTime) return;
    
    // Create study session
    await addStudySession({
      subjectId,
      topicId: topicId || undefined,
      startTime: startDateTime,
      endTime: endDateTime,
      completed: false
    });
    
    // Close dialog and reset form
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <motion.button
          className="fixed right-4 bottom-20 w-14 h-14 rounded-full bg-[#FF5252] flex items-center justify-center shadow-lg text-white z-40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i className="ri-add-line text-2xl"></i>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="bg-[#1E1E1E] text-[#E0E0E0] border-[#333333] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#E0E0E0]">Plan Study Session</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select 
              value={formData.subjectId}
              onValueChange={(value) => handleChange("subjectId", value)}
            >
              <SelectTrigger className="bg-[#252525] border-[#333333] text-[#E0E0E0]">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent className="bg-[#252525] border-[#333333] text-[#E0E0E0]">
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.subjectId && (
            <div className="space-y-2">
              <Label htmlFor="topic">Topic (Optional)</Label>
              <Select 
                value={formData.topicId}
                onValueChange={(value) => handleChange("topicId", value)}
              >
                <SelectTrigger className="bg-[#252525] border-[#333333] text-[#E0E0E0]">
                  <SelectValue placeholder="Select a topic (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-[#252525] border-[#333333] text-[#E0E0E0]">
                  {subjectTopics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="bg-[#252525] border-[#333333] text-[#E0E0E0]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                className="bg-[#252525] border-[#333333] text-[#E0E0E0]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                className="bg-[#252525] border-[#333333] text-[#E0E0E0]"
              />
            </div>
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
            Add Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudySessionForm;
