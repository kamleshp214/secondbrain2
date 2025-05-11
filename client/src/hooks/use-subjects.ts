import { useLiveQuery } from 'dexie-react-hooks';
import { db, Subject } from '../db/schema';
import { useState } from 'react';

export function useSubjects() {
  const [loading, setLoading] = useState(true);
  
  // Fetch all subjects from the database
  const subjects = useLiveQuery(
    () => db.subjects.toArray(),
    [],
    []
  );
  
  // Set loading state when subjects are loaded
  if (subjects && loading) {
    setLoading(false);
  }
  
  // Add a new subject
  const addSubject = async (subject: Omit<Subject, 'id'>) => {
    const id = Date.now().toString();
    await db.subjects.add({ ...subject, id });
    return id;
  };
  
  // Update a subject
  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    await db.subjects.update(id, updates);
  };
  
  // Delete a subject
  const deleteSubject = async (id: string) => {
    // First delete all topics related to this subject
    await db.topics.where({ subjectId: id }).delete();
    // Then delete all study sessions related to this subject
    await db.studySessions.where({ subjectId: id }).delete();
    // Finally delete the subject
    await db.subjects.delete(id);
  };
  
  return {
    subjects: subjects || [],
    loading,
    addSubject,
    updateSubject,
    deleteSubject
  };
}
