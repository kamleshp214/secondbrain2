import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const PomodoroTimer = () => {
  const { toast } = useToast();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [focusLength, setFocusLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Format time for display
  const formatTime = useCallback(() => {
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [minutes, seconds]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            clearInterval(interval!);
            const newMode = mode === "focus" ? "break" : "focus";
            
            if (mode === "focus") {
              setCompletedSessions(prev => prev + 1);
              toast({
                title: "Focus session completed!",
                description: "Take a break now.",
              });
              setMinutes(breakLength);
            } else {
              toast({
                title: "Break time over!",
                description: "Back to focus mode.",
              });
              setMinutes(focusLength);
            }
            
            setMode(newMode);
            setSeconds(0);
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, mode, focusLength, breakLength, toast]);

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    if (mode === "focus") {
      setMinutes(focusLength);
    } else {
      setMinutes(breakLength);
    }
    setSeconds(0);
  };

  // Toggle timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Switch modes manually
  const switchMode = () => {
    setIsActive(false);
    if (mode === "focus") {
      setMode("break");
      setMinutes(breakLength);
    } else {
      setMode("focus");
      setMinutes(focusLength);
    }
    setSeconds(0);
  };

  // Update focus length
  const handleFocusChange = (value: number[]) => {
    const newLength = value[0];
    setFocusLength(newLength);
    if (mode === "focus" && !isActive) {
      setMinutes(newLength);
      setSeconds(0);
    }
  };

  // Update break length
  const handleBreakChange = (value: number[]) => {
    const newLength = value[0];
    setBreakLength(newLength);
    if (mode === "break" && !isActive) {
      setMinutes(newLength);
      setSeconds(0);
    }
  };

  // Calculate progress for the circle
  const calculateProgress = () => {
    const totalSeconds = mode === "focus" ? focusLength * 60 : breakLength * 60;
    const currentSeconds = minutes * 60 + seconds;
    return (1 - currentSeconds / totalSeconds) * 100;
  };

  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 w-full">
      <h2 className="text-xl font-bold text-[#E0E0E0] mb-4 flex items-center">
        <i className="ri-timer-line text-[#FF5252] mr-2"></i>
        Pomodoro Timer
      </h2>

      <div className="flex flex-col items-center mb-6">
        {/* Timer Circle */}
        <div className="relative w-48 h-48 mb-4">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#333333"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={mode === "focus" ? "#FF5252" : "#52C0FF"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * calculateProgress()) / 100}
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * calculateProgress()) / 100 }}
              transition={{ duration: 0.5 }}
            />
            {/* Inner text group */}
            <g className="text-center">
              <text x="50" y="45" textAnchor="middle" fill="#E0E0E0" fontSize="16" fontWeight="bold">
                {formatTime()}
              </text>
              <text x="50" y="65" textAnchor="middle" fill="#AAAAAA" fontSize="10">
                {mode === "focus" ? "FOCUS TIME" : "BREAK TIME"}
              </text>
            </g>
          </svg>
        </div>

        {/* Session count */}
        <div className="mb-4 text-center">
          <p className="text-sm text-[#AAAAAA]">Completed Sessions</p>
          <p className="text-2xl font-bold text-[#FF5252]">{completedSessions}</p>
        </div>

        {/* Timer Controls */}
        <div className="flex space-x-2 mb-6">
          <Button
            onClick={toggleTimer}
            variant="outline"
            className={`px-6 ${
              isActive
                ? "bg-[#333333] hover:bg-[#444444]"
                : "bg-[#FF5252] hover:bg-[#D32F2F] text-white"
            }`}
          >
            {isActive ? (
              <>
                <i className="ri-pause-line mr-2"></i> Pause
              </>
            ) : (
              <>
                <i className="ri-play-line mr-2"></i> Start
              </>
            )}
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            className="bg-[#333333] hover:bg-[#444444]"
          >
            <i className="ri-refresh-line mr-2"></i> Reset
          </Button>
          <Button
            onClick={switchMode}
            variant="outline"
            className="bg-[#333333] hover:bg-[#444444]"
          >
            <i className="ri-exchange-line mr-2"></i> Switch
          </Button>
        </div>
      </div>

      {/* Timer Settings */}
      <div className="space-y-4 mt-6 border-t border-[#333333] pt-4">
        <h3 className="text-sm font-medium text-[#AAAAAA] mb-2">Settings</h3>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm">Focus: {focusLength} min</label>
          </div>
          <Slider
            value={[focusLength]}
            min={5}
            max={60}
            step={5}
            onValueChange={handleFocusChange}
            disabled={isActive}
            className="mt-2"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm">Break: {breakLength} min</label>
          </div>
          <Slider
            value={[breakLength]}
            min={1}
            max={30}
            step={1}
            onValueChange={handleBreakChange}
            disabled={isActive}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;