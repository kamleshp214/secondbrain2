import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../context/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const FocusEnvironment = () => {
  const { subjects, topics, addStudySession } = useApp();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState<"motivated" | "neutral" | "tired">("neutral");
  const [studyDuration, setStudyDuration] = useState(25); // minutes
  const [savedSessions, setSavedSessions] = useState<Array<{
    id: string;
    subject: string;
    unit?: string;
    notes: string;
    duration: number;
    date: Date;
  }>>([]);

  // Filter units based on selected subject
  const filteredUnits = topics.filter(
    (topic) => topic.subjectId === selectedSubject
  );

  // Handle study session completion
  const handleSessionComplete = () => {
    if (!selectedSubject) {
      toast({
        title: "Subject Required",
        description: "Please select a subject for your study session",
        variant: "destructive",
      });
      return;
    }

    // Create start and end times for the session
    const now = new Date();
    const startTime = new Date(now);
    const endTime = new Date(now);
    endTime.setMinutes(endTime.getMinutes() + studyDuration);

    // Save the session
    addStudySession({
      subjectId: selectedSubject,
      topicId: selectedUnit || undefined,
      startTime,
      endTime,
      completed: true,
    }).then((id) => {
      // Add to the local list for immediate display
      const subject = subjects.find(s => s.id === selectedSubject);
      const unit = selectedUnit ? topics.find(t => t.id === selectedUnit) : undefined;
      
      setSavedSessions([
        {
          id,
          subject: subject?.name || "Unknown Subject",
          unit: unit?.name,
          notes,
          duration: studyDuration,
          date: now,
        },
        ...savedSessions,
      ]);

      // Clear the form
      setNotes("");
      
      // Show success message
      toast({
        title: "Session Saved",
        description: `You've completed a ${studyDuration} minute study session!`,
      });
    });
  };

  // Mood icon and color mapping
  const moodConfig = {
    motivated: { icon: "ri-emotion-happy-line", color: "#4CAF50", label: "Motivated" },
    neutral: { icon: "ri-emotion-normal-line", color: "#FFC107", label: "Neutral" },
    tired: { icon: "ri-emotion-unhappy-line", color: "#FF5252", label: "Tired" },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Study Session Form */}
        <motion.div
          className="bg-[#1E1E1E] rounded-xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <i className="ri-mental-health-line text-[#FF5252] mr-2"></i>
            Focus Session
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger id="subject" className="bg-[#252525] border-[#333333] text-[#E0E0E0]">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent className="bg-[#252525] border-[#333333] text-[#E0E0E0]">
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id} className="focus:bg-[#333333] focus:text-[#E0E0E0]">
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSubject && (
              <div className="space-y-2">
                <Label htmlFor="unit">Unit (Optional)</Label>
                <Select 
                  value={selectedUnit} 
                  onValueChange={setSelectedUnit}
                >
                  <SelectTrigger id="unit" className="bg-[#252525] border-[#333333] text-[#E0E0E0]">
                    <SelectValue placeholder="Select a unit (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#252525] border-[#333333] text-[#E0E0E0]">
                    <SelectItem value="general" className="focus:bg-[#333333] focus:text-[#E0E0E0]">
                      None (General Study)
                    </SelectItem>
                    {filteredUnits.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id} className="focus:bg-[#333333] focus:text-[#E0E0E0]">
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="duration">Study Duration (minutes)</Label>
              <div className="flex items-center space-x-2">
                {[15, 25, 30, 45, 60].map((duration) => (
                  <Button
                    key={duration}
                    type="button"
                    size="sm"
                    variant={studyDuration === duration ? "default" : "outline"}
                    className={studyDuration === duration 
                      ? "bg-[#FF5252] hover:bg-[#D32F2F] text-white border-none" 
                      : "bg-[#252525] border-[#333333] text-[#E0E0E0] hover:bg-[#333333]"}
                    onClick={() => setStudyDuration(duration)}
                  >
                    {duration}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mood">How are you feeling?</Label>
              <div className="flex items-center space-x-4">
                {(Object.keys(moodConfig) as Array<keyof typeof moodConfig>).map((moodKey) => {
                  const { icon, color, label } = moodConfig[moodKey];
                  return (
                    <Button
                      key={moodKey}
                      type="button"
                      variant="outline"
                      className={`flex-col h-auto py-2 px-3 ${
                        mood === moodKey 
                          ? `border-2 border-[${color}] bg-[${color}10]` 
                          : "bg-[#252525] border-[#333333]"
                      }`}
                      onClick={() => setMood(moodKey)}
                    >
                      <i className={`${icon} text-2xl`} style={{ color }}></i>
                      <span className="text-xs mt-1">{label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Session Notes</Label>
              <Textarea
                id="notes"
                placeholder="What did you learn? What worked well? Any challenges?"
                className="bg-[#252525] border-[#333333] text-[#E0E0E0] min-h-[100px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button
              className="w-full bg-[#FF5252] hover:bg-[#D32F2F] text-white mt-2"
              onClick={handleSessionComplete}
            >
              <i className="ri-check-line mr-2"></i>
              Complete Study Session
            </Button>
          </div>
        </motion.div>

        {/* Recent Sessions */}
        <motion.div
          className="bg-[#1E1E1E] rounded-xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <i className="ri-history-line text-[#FF5252] mr-2"></i>
            Recent Sessions
          </h2>

          <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
            {savedSessions.length > 0 ? (
              savedSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  className="bg-[#252525] p-3 rounded-lg border border-[#333333]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex justify-between mb-1">
                    <h3 className="font-medium text-[#E0E0E0]">{session.subject}</h3>
                    <Badge variant="outline" className="bg-[#FF525210] border-[#FF5252] text-[#FF5252]">
                      {session.duration} min
                    </Badge>
                  </div>
                  
                  <div className="flex items-center mb-2 text-xs text-[#AAAAAA]">
                    <i className="ri-calendar-line mr-1"></i>
                    <span>{format(session.date, "MMM d, h:mm a")}</span>
                    
                    {session.unit && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{session.unit}</span>
                      </>
                    )}
                  </div>
                  
                  {session.notes && (
                    <div className="bg-[#1E1E1E] p-2 rounded text-xs text-[#AAAAAA] mt-2">
                      {session.notes}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-[#AAAAAA]">
                <i className="ri-file-list-3-line text-4xl mb-2 block"></i>
                <p>No study sessions yet</p>
                <p className="text-xs mt-1">Complete a focus session to see it here</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Focus Tips */}
      <motion.div
        className="bg-[#1E1E1E] rounded-xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <i className="ri-lightbulb-line text-[#FF5252] mr-2"></i>
          Study Focus Tips
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="bg-[#252525] border-[#333333]">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-[#FF525220] rounded-full flex items-center justify-center mr-2">
                  <i className="ri-timer-line text-[#FF5252]"></i>
                </div>
                <h3 className="font-medium text-[#E0E0E0]">Pomodoro Technique</h3>
              </div>
              <p className="text-xs text-[#AAAAAA]">
                Study for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer break.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#252525] border-[#333333]">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-[#FF525220] rounded-full flex items-center justify-center mr-2">
                  <i className="ri-focus-3-line text-[#FF5252]"></i>
                </div>
                <h3 className="font-medium text-[#E0E0E0]">Active Recall</h3>
              </div>
              <p className="text-xs text-[#AAAAAA]">
                Test yourself on the material instead of passively re-reading it for better retention.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#252525] border-[#333333]">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-[#FF525220] rounded-full flex items-center justify-center mr-2">
                  <i className="ri-repeat-line text-[#FF5252]"></i>
                </div>
                <h3 className="font-medium text-[#E0E0E0]">Spaced Repetition</h3>
              </div>
              <p className="text-xs text-[#AAAAAA]">
                Review material at increasing intervals to improve long-term retention.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default FocusEnvironment;