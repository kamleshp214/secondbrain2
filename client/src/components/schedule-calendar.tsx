import { useState, useCallback, useMemo } from "react";
import { useApp } from "../context/app-context";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

// Setup localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const ScheduleCalendar = () => {
  const { subjects, studySessions, updateStudySession, deleteStudySession } = useApp();
  const [view, setView] = useState("week");
  const [date, setDate] = useState(new Date());

  // Map subjects to a color
  const subjectColors = useMemo(() => {
    const colors = [
      "#FF5252", "#FF7252", "#FF9252", "#FFB252", 
      "#FFD252", "#FFF252", "#D2FF52", "#92FF52"
    ];
    
    return subjects.reduce((acc, subject, index) => {
      acc[subject.id] = colors[index % colors.length];
      return acc;
    }, {} as Record<string, string>);
  }, [subjects]);

  // Convert study sessions to events for the calendar
  const events = useMemo(() => {
    return studySessions.map(session => {
      const subject = subjects.find(s => s.id === session.subjectId);
      return {
        id: session.id,
        title: subject ? subject.name : "Study Session",
        start: session.startTime,
        end: session.endTime,
        resourceId: session.subjectId,
        completed: session.completed,
        color: subjectColors[session.subjectId] || "#FF5252"
      };
    });
  }, [studySessions, subjects, subjectColors]);

  // Handle event selection
  const handleSelectEvent = useCallback((event: any) => {
    const session = studySessions.find(s => s.id === event.id);
    if (!session) return;
  }, [studySessions]);

  // Custom event component
  const EventComponent = ({ event }: any) => {
    const handleComplete = async () => {
      await updateStudySession(event.id, { completed: !event.completed });
    };

    const handleDelete = async () => {
      await deleteStudySession(event.id);
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div
            style={{
              backgroundColor: event.color,
              opacity: event.completed ? 0.6 : 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <div className="px-2">
              <p className="font-medium text-white truncate">{event.title}</p>
              <p className="text-xs text-white">
                {moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")}
              </p>
              {event.completed && (
                <div className="flex items-center mt-1">
                  <i className="ri-check-line text-white mr-1"></i>
                  <span className="text-xs text-white">Completed</span>
                </div>
              )}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-[#252525] border-[#333333] text-[#E0E0E0] w-64">
          <div className="space-y-3">
            <h4 className="font-medium">{event.title}</h4>
            <p className="text-sm">
              {moment(event.start).format("MMM D, YYYY h:mm A")} - {moment(event.end).format("h:mm A")}
            </p>
            <div className="flex justify-between pt-2">
              <Button 
                size="sm" 
                variant="outline"
                className="bg-[#333333] border-[#444444] text-[#E0E0E0]"
                onClick={handleComplete}
              >
                {event.completed ? "Mark Incomplete" : "Mark Complete"}
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <motion.div
      className="bg-[#1E1E1E] rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {studySessions.length === 0 ? (
        <Alert className="bg-[#252525] border-[#333333] text-[#E0E0E0] m-4">
          <AlertDescription>
            No study sessions scheduled yet. Use the + button to add your first session.
          </AlertDescription>
        </Alert>
      ) : null}
      
      <div className="h-[600px] p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.WEEK}
          views={['day', 'week', 'month']}
          step={60}
          onView={setView as any}
          date={date}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          components={{
            event: EventComponent
          }}
          className="text-[#E0E0E0]"
        />
      </div>
    </motion.div>
  );
};

export default ScheduleCalendar;
