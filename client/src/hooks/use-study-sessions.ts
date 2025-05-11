import { useLiveQuery } from 'dexie-react-hooks';
import { db, StudySession } from '../db/schema';
import { doTimesOverlap } from '../lib/date-utils';

export function useStudySessions(subjectId?: string) {
  // Fetch study sessions, optionally filtered by subject ID
  const studySessions = useLiveQuery(
    () => {
      if (subjectId) {
        return db.studySessions.where({ subjectId }).toArray();
      }
      return db.studySessions.toArray();
    },
    [subjectId],
    []
  );
  
  // Get upcoming study sessions (within the next 24 hours)
  const upcomingSessions = useLiveQuery(
    () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      return db.studySessions
        .where('startTime')
        .between(now, tomorrow, true, true)
        .and(session => !session.completed)
        .toArray();
    },
    [],
    []
  );
  
  // Add a new study session
  const addStudySession = async (session: Omit<StudySession, 'id'>) => {
    // Check for conflicts
    const conflicts = await checkForConflicts(session.startTime, session.endTime);
    if (conflicts.length > 0) {
      throw new Error('This session conflicts with existing sessions');
    }
    
    const id = Date.now().toString();
    await db.studySessions.add({ ...session, id });
    return id;
  };
  
  // Update a study session
  const updateStudySession = async (id: string, updates: Partial<StudySession>) => {
    const currentSession = await db.studySessions.get(id);
    if (!currentSession) return;
    
    // If we're updating times, check for conflicts
    if (updates.startTime || updates.endTime) {
      const newStart = updates.startTime || currentSession.startTime;
      const newEnd = updates.endTime || currentSession.endTime;
      
      const conflicts = await checkForConflicts(newStart, newEnd, id);
      if (conflicts.length > 0) {
        throw new Error('This update would create conflicts with existing sessions');
      }
    }
    
    await db.studySessions.update(id, updates);
  };
  
  // Delete a study session
  const deleteStudySession = async (id: string) => {
    await db.studySessions.delete(id);
  };
  
  // Check for time conflicts with existing sessions
  const checkForConflicts = async (
    startTime: Date, 
    endTime: Date, 
    excludeId?: string
  ): Promise<StudySession[]> => {
    const allSessions = await db.studySessions.toArray();
    
    return allSessions.filter(session => {
      // Skip the session we're updating
      if (excludeId && session.id === excludeId) return false;
      
      // Check if times overlap
      return doTimesOverlap(
        startTime,
        endTime,
        session.startTime,
        session.endTime
      );
    });
  };
  
  // Complete a study session
  const completeStudySession = async (id: string) => {
    await db.studySessions.update(id, { completed: true });
  };
  
  return {
    studySessions: studySessions || [],
    upcomingSessions: upcomingSessions || [],
    addStudySession,
    updateStudySession,
    deleteStudySession,
    completeStudySession,
    checkForConflicts
  };
}
