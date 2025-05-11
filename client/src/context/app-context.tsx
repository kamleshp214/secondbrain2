import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, Subject, Topic, StudySession } from '../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';

// Define the context type
interface AppContextType {
  subjects: Subject[];
  topics: Topic[];
  studySessions: StudySession[];
  loading: boolean;
  updateTopic: (topicId: string, updates: Partial<Topic>) => Promise<void>;
  addSubject: (subject: Omit<Subject, 'id'>) => Promise<string>;
  addTopic: (topic: Omit<Topic, 'id'>) => Promise<string>;
  addStudySession: (session: Omit<StudySession, 'id'>) => Promise<string>;
  updateStudySession: (sessionId: string, updates: Partial<StudySession>) => Promise<void>;
  deleteSubject: (subjectId: string) => Promise<void>;
  deleteTopic: (topicId: string) => Promise<void>;
  deleteStudySession: (sessionId: string) => Promise<void>;
  getTopicsBySubject: (subjectId: string) => Topic[];
  getStudySessionsBySubject: (subjectId: string) => StudySession[];
  getCompletedTopicsCount: (subjectId: string) => number;
  getTotalTopicsCount: (subjectId: string) => number;
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  // Use Dexie live queries to get real-time data
  const subjects = useLiveQuery(() => db.subjects.toArray(), []) || [];
  const topics = useLiveQuery(() => db.topics.toArray(), []) || [];
  const studySessions = useLiveQuery(() => db.studySessions.toArray(), []) || [];

  // Set loading to false once data is loaded
  useEffect(() => {
    if (subjects.length > 0) {
      setLoading(false);
    }
  }, [subjects]);

  // Update a topic
  const updateTopic = async (topicId: string, updates: Partial<Topic>) => {
    await db.topics.update(topicId, updates);
  };

  // Add a new subject
  const addSubject = async (subject: Omit<Subject, 'id'>) => {
    const id = generateId();
    await db.subjects.add({ ...subject, id });
    return id;
  };

  // Add a new topic
  const addTopic = async (topic: Omit<Topic, 'id'>) => {
    const id = generateId();
    await db.topics.add({ ...topic, id });
    return id;
  };

  // Add a new study session
  const addStudySession = async (session: Omit<StudySession, 'id'>) => {
    const id = generateId();
    await db.studySessions.add({ ...session, id });
    return id;
  };

  // Update a study session
  const updateStudySession = async (sessionId: string, updates: Partial<StudySession>) => {
    await db.studySessions.update(sessionId, updates);
  };

  // Delete a subject and all related topics and study sessions
  const deleteSubject = async (subjectId: string) => {
    await db.transaction('rw', db.subjects, db.topics, db.studySessions, async () => {
      // Delete all related topics and study sessions
      await db.topics.where({ subjectId }).delete();
      await db.studySessions.where({ subjectId }).delete();
      // Delete the subject
      await db.subjects.delete(subjectId);
    });
  };

  // Delete a topic
  const deleteTopic = async (topicId: string) => {
    await db.transaction('rw', db.topics, db.studySessions, async () => {
      // Delete all related study sessions
      await db.studySessions.where({ topicId }).delete();
      // Delete the topic
      await db.topics.delete(topicId);
    });
  };

  // Delete a study session
  const deleteStudySession = async (sessionId: string) => {
    await db.studySessions.delete(sessionId);
  };

  // Get topics by subject ID
  const getTopicsBySubject = (subjectId: string) => {
    return topics.filter(topic => topic.subjectId === subjectId);
  };

  // Get study sessions by subject ID
  const getStudySessionsBySubject = (subjectId: string) => {
    return studySessions.filter(session => session.subjectId === subjectId);
  };

  // Get count of completed topics for a subject
  const getCompletedTopicsCount = (subjectId: string) => {
    return topics.filter(topic => topic.subjectId === subjectId && topic.completed).length;
  };

  // Get total count of topics for a subject
  const getTotalTopicsCount = (subjectId: string) => {
    return topics.filter(topic => topic.subjectId === subjectId).length;
  };

  const value: AppContextType = {
    subjects,
    topics,
    studySessions,
    loading,
    updateTopic,
    addSubject,
    addTopic,
    addStudySession,
    updateStudySession,
    deleteSubject,
    deleteTopic,
    deleteStudySession,
    getTopicsBySubject,
    getStudySessionsBySubject,
    getCompletedTopicsCount,
    getTotalTopicsCount
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
