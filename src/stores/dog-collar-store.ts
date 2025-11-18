import { create } from 'zustand';
import { onVisitsUpdate } from '@/lib/services/rtdb';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type PersonStatus = {
  person: 'Person A' | 'Person B';
  visits: number;
  proximity: number;
  total_time: number;
  last_updated: string;
  near_time_start?: string;
  near_time_end?: string;
};

type Store = {
  personA: PersonStatus | null;
  personB: PersonStatus | null;
  isLoading: boolean;
  error: Error | null;
  subscribe: () => () => void;
  updatePersonA: (data: Partial<PersonStatus>) => void;
  updatePersonB: (data: Partial<PersonStatus>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
};

// Helper function to get recent documents from Firestore
const getRecentDocuments = async (collectionName: string, limitCount = 50) => {
  const q = query(
    collection(db, collectionName),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Helper function to find the most recent transition between states
const findTransition = (docs: any[], from: number, to: number): string => {
  if (docs.length < 2) return 'N/A';
  
  // Sort by timestamp in ascending order (oldest first)
  const sorted = [...docs].sort((a, b) => 
    (a.timestamp?.toDate?.()?.getTime() || 0) - (b.timestamp?.toDate?.()?.getTime() || 0)
  );

  // Find the first document where proximity = from and next document = to
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].proximity === from && sorted[i + 1].proximity === to) {
      const date = sorted[i + 1].timestamp?.toDate?.() || new Date(sorted[i + 1].timestamp);
      return date.toLocaleString();
    }
  }
  return 'N/A';
};

export const useDogCollarStore = create<Store>((set, get) => ({
  personA: null,
  personB: null,
  isLoading: true,
  error: null,
  
  updatePersonA: (data) => set((state) => ({
    personA: { 
      ...(state.personA || { 
        person: 'Person A',
        visits: 0,
        proximity: 0,
        total_time: 0,
        last_updated: new Date().toLocaleString()
      }), 
      ...data 
    }
  })),
  
  updatePersonB: (data) => set((state) => ({
    personB: { 
      ...(state.personB || { 
        person: 'Person B',
        visits: 0,
        proximity: 0,
        total_time: 0,
        last_updated: new Date().toLocaleString()
      }), 
      ...data 
    }
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  subscribe: () => {
    // Format timestamp helper
    const formatTimestamp = (ts: any): string => {
      if (!ts) return 'N/A';
      try {
        const date = ts.toDate ? ts.toDate() : new Date(ts);
        return date.toLocaleString();
      } catch (e) {
        return 'Invalid Date';
      }
    };

    // Initialize with current data
    const initialize = async () => {
      try {
        get().setLoading(true);
        
        // Fetch recent documents for both persons
        const [personADocs, personBDocs] = await Promise.all([
          getRecentDocuments('PersonA'),
          getRecentDocuments('PersonB')
        ]);

        // Helper function to process person data
        const processPersonData = (docs: any[], person: 'A' | 'B') => {
          if (docs.length === 0) return;
          
          // Get most recent document
          const latestDoc = [...docs].sort((a, b) => 
            (b.timestamp?.toDate?.()?.getTime() || 0) - (a.timestamp?.toDate?.()?.getTime() || 0)
          )[0];
          
          const latestProximity = latestDoc?.proximity;
          
          // Get transition times
          let nearTimeStart = latestProximity === 1 
            ? formatTimestamp(latestDoc.timestamp)
            : findTransition(docs, 0, 1);
            
          let nearTimeEnd = latestProximity === 0
            ? formatTimestamp(latestDoc.timestamp)
            : findTransition(docs, 1, 0);
            
          // Ensure start time is before end time
          if (nearTimeStart !== 'N/A' && nearTimeEnd !== 'N/A') {
            const startTime = new Date(nearTimeStart).getTime();
            const endTime = new Date(nearTimeEnd).getTime();
            
            if (!isNaN(startTime) && !isNaN(endTime) && startTime >= endTime) {
              // If start time is after or equal to end time, set end time to N/A
              nearTimeEnd = 'N/A';
            }
          }

          const updateData = {
            near_time_start: nearTimeStart,
            near_time_end: nearTimeEnd,
            last_updated: new Date().toLocaleString()
          };

          // Update the appropriate person
          if (person === 'A') {
            get().updatePersonA(updateData);
          } else {
            get().updatePersonB(updateData);
          }
        };

        // Process both persons
        processPersonData(personADocs, 'A');
        processPersonData(personBDocs, 'B');
      } catch (error) {
        console.error('Error initializing store:', error);
        get().setError(error instanceof Error ? error : new Error('Failed to initialize store'));
      } finally {
        get().setLoading(false);
      }
    };

    // Set up RTDB listener
    const unsubscribeRTDB = onVisitsUpdate(({ personA, personB }) => {
      const now = new Date();
      get().updatePersonA({
        visits: personA.visits,
        proximity: personA.proximity,
        total_time: personA.total_time,
        last_updated: now.toLocaleString()
      });
      
      get().updatePersonB({
        visits: personB.visits,
        proximity: personB.proximity,
        total_time: personB.total_time,
        last_updated: now.toLocaleString()
      });
    });

    // Initialize with current data
    initialize();

    // Return cleanup function
    return () => {
      unsubscribeRTDB();
    };
  }
}));
