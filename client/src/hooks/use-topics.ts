import { useLiveQuery } from 'dexie-react-hooks';
import { db, Topic } from '../db/schema';

export function useTopics(subjectId?: string) {
  // Fetch topics, optionally filtered by subject ID
  const topics = useLiveQuery(
    () => {
      if (subjectId) {
        return db.topics.where({ subjectId }).toArray();
      }
      return db.topics.toArray();
    },
    [subjectId],
    []
  );
  
  // Get count of completed topics
  const completedCount = useLiveQuery(
    () => {
      if (subjectId) {
        return db.topics.where({ subjectId, completed: true }).count();
      }
      return db.topics.where({ completed: true }).count();
    },
    [subjectId],
    0
  );
  
  // Get total count of topics
  const totalCount = useLiveQuery(
    () => {
      if (subjectId) {
        return db.topics.where({ subjectId }).count();
      }
      return db.topics.count();
    },
    [subjectId],
    0
  );
  
  // Add a new topic
  const addTopic = async (topic: Omit<Topic, 'id'>) => {
    const id = Date.now().toString();
    await db.topics.add({ ...topic, id });
    return id;
  };
  
  // Update a topic
  const updateTopic = async (id: string, updates: Partial<Topic>) => {
    await db.topics.update(id, updates);
  };
  
  // Delete a topic
  const deleteTopic = async (id: string) => {
    // First delete any study sessions related to this topic
    await db.studySessions.where({ topicId: id }).delete();
    // Then delete the topic
    await db.topics.delete(id);
  };
  
  // Toggle topic completion
  const toggleCompletion = async (id: string) => {
    const topic = await db.topics.get(id);
    if (topic) {
      await db.topics.update(id, { completed: !topic.completed });
    }
  };
  
  return {
    topics: topics || [],
    completedCount,
    totalCount,
    progress: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
    addTopic,
    updateTopic,
    deleteTopic,
    toggleCompletion
  };
}
