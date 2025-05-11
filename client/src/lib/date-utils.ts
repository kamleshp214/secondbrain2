import { formatDistanceToNow, format, isToday, isTomorrow, isYesterday } from 'date-fns';

// Format date for display
export const formatDate = (date: Date): string => {
  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow, ${format(date, 'h:mm a')}`;
  } else if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'h:mm a')}`;
  } else {
    return format(date, 'MMM d, yyyy h:mm a');
  }
};

// Format time only
export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

// Calculate time until an exam
export const getTimeUntilExam = (examDate: Date): string => {
  return formatDistanceToNow(examDate, { addSuffix: true });
};

// Calculate completion percentage
export const calculateCompletion = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

// Format duration from start and end time
export const formatDuration = (startTime: Date, endTime: Date): string => {
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (durationHours === 0) {
    return `${durationMinutes} min`;
  } else if (durationMinutes === 0) {
    return `${durationHours} hr`;
  } else {
    return `${durationHours} hr ${durationMinutes} min`;
  }
};

// Check if two time ranges overlap
export const doTimesOverlap = (
  startA: Date, 
  endA: Date, 
  startB: Date, 
  endB: Date
): boolean => {
  return startA < endB && startB < endA;
};
