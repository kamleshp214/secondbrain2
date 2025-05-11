import Dexie, { Table } from 'dexie';

// Define the types for our database tables
export interface Subject {
  id: string;
  name: string;
  examDate: Date;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  completed: boolean;
  goalDate?: Date;
}

export interface StudySession {
  id: string;
  subjectId: string;
  topicId?: string;
  startTime: Date;
  endTime: Date;
  completed: boolean;
}

// Define our database
export class SecondBrainDatabase extends Dexie {
  subjects!: Table<Subject>;
  topics!: Table<Topic>;
  studySessions!: Table<StudySession>;

  constructor() {
    super('SecondBrainDB');
    
    // Define tables and indexes
    this.version(1).stores({
      subjects: 'id, name, examDate',
      topics: 'id, subjectId, name, completed, goalDate',
      studySessions: 'id, subjectId, topicId, startTime, endTime, completed'
    });
  }
}

// Create and export a database instance
export const db = new SecondBrainDatabase();
