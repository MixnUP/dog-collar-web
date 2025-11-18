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
const getRecentDocuments = async (collectionName: string, limitCount = 1) => {
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
    // Initialize with current data
    const initialize = async () => {
      try {
        get().setLoading(true);
        
        // Get initial data from Firestore
        const [personAData, personBData] = await Promise.all([
          getRecentDocuments('PersonA'),
          getRecentDocuments('PersonB')
        ]);

        // Format timestamps
        const formatTimestamp = (ts: any): string => {
          if (!ts) return 'N/A';
          try {
            const date = ts.toDate ? ts.toDate() : new Date(ts);
            return date.toLocaleString();
          } catch (e) {
            return 'Invalid Date';
          }
        };

        // Update store with Firestore data
        if (personAData.length > 0) {
          const data = personAData[0] as any;
          get().updatePersonA({
            near_time_start: formatTimestamp(data.near_time_start),
            near_time_end: formatTimestamp(data.near_time_end),
            last_updated: formatTimestamp(data.timestamp)
          });
        }

        if (personBData.length > 0) {
          const data = personBData[0] as any;
          get().updatePersonB({
            near_time_start: formatTimestamp(data.near_time_start),
            near_time_end: formatTimestamp(data.near_time_end),
            last_updated: formatTimestamp(data.timestamp)
          });
        }
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
