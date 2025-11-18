import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
} from "firebase/firestore";
import { db } from "../firebase";
import type { DogCollar } from "@/types";

const COLLECTION_NAMES = {
  PERSON_A: "PersonA",
  PERSON_B: "PersonB"
} as const;

export const useDogCollars = (limit: number, offset: number, personFilter: "All" | "Person A" | "Person B", sortFilter: "All" | "Ascending" | "Descending" | "Visits" | "Total Time") => {
  return useQuery<{ data: DogCollar[], totalCount: number }, Error>({
    queryKey: ["dog-collars", { limit, offset, personFilter, sortFilter }],
    queryFn: async () => {
      const startIndex = offset * limit;

      let personAData: DogCollar[] = [];
      let personBData: DogCollar[] = [];
      let totalCount = 0;

      const getOrderByClause = (filter: typeof sortFilter) => {
        switch (filter) {
          case "Ascending":
            return orderBy("timestamp", "asc");
          case "Visits":
            return orderBy("visits", "desc"); // Assuming descending for higher visits
          case "Total Time":
            return orderBy("totalTime", "desc"); // Corrected to totalTime
          case "Descending":
          case "All":
          default:
            return orderBy("timestamp", "desc");
        }
      };

      const orderByClause = getOrderByClause(sortFilter);

      const fetchAndMapData = async (collectionName: string, personId: "Person A" | "Person B") => {
        const q = query(collection(db, collectionName), orderByClause);
        const docs = await getDocs(q);
        return docs.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            person: personId,
            ...data,
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp,
            near_time_start: data.near_time_start?.toDate ? data.near_time_start.toDate() : data.near_time_start,
            near_time_end: data.near_time_end?.toDate ? data.near_time_end.toDate() : data.near_time_end,
            total_time: data.total_time ?? data.totalTime ?? 0,
            visits: data.visits ?? 0,
            proximity: data.proximity ?? 0
          };
        });
      };

      const fetchCount = async (collectionName: string) => {
        const snapshot = await getDocs(collection(db, collectionName));
        return snapshot.size;
      };

      if (personFilter === "All" || personFilter === "Person A") {
        personAData = await fetchAndMapData(COLLECTION_NAMES.PERSON_A, "Person A");
        totalCount += await fetchCount(COLLECTION_NAMES.PERSON_A);
      }
      if (personFilter === "All" || personFilter === "Person B") {
        personBData = await fetchAndMapData(COLLECTION_NAMES.PERSON_B, "Person B");
        totalCount += await fetchCount(COLLECTION_NAMES.PERSON_B);
      }

      // Merge both arrays and sort by timestamp in descending order
      let mergedData = [...personAData, ...personBData];

      mergedData.sort((a, b) => {
        // Custom sorting logic for "Visits" and "Total Time" if not handled by Firestore orderBy
        // Firestore orderBy handles single field sorting. For merged data, if sortFilter is not timestamp,
        // we need to re-sort here.
        if (sortFilter === "Visits") {
          return (b.visits ?? 0) - (a.visits ?? 0);
        }
        if (sortFilter === "Total Time") {
          return (b.total_time ?? 0) - (a.total_time ?? 0);
        }
        // Helper function to convert any timestamp format to milliseconds
        const toMilliseconds = (timestamp: string | Date | Timestamp | undefined): number => {
          if (!timestamp) return 0;
          if (timestamp instanceof Date) return timestamp.getTime();
          if (typeof timestamp === 'string') return new Date(timestamp).getTime();
          if (timestamp.toDate) return timestamp.toDate().getTime();
          return 0;
        };
        
        const dateA = toMilliseconds(a.timestamp);
        const dateB = toMilliseconds(b.timestamp);
        return sortFilter === "Ascending" ? dateA - dateB : dateB - dateA;
      });

      // Apply client-side slice to get the current page's data
      const paginatedData = mergedData.slice(startIndex, startIndex + limit);

      return { data: paginatedData, totalCount };
    },
  });
};

export const useDogCollar = (id: string) => {
  return useQuery<DogCollar | null, Error>({
    queryKey: ["dog-collar", id],
    queryFn: async () => {
      // Try to find the document in either collection
      const [personADoc, personBDoc] = await Promise.all([
        getDoc(doc(db, COLLECTION_NAMES.PERSON_A, id)),
        getDoc(doc(db, COLLECTION_NAMES.PERSON_B, id))
      ]);

      const docSnap = personADoc.exists() ? personADoc : personBDoc;
      if (!docSnap.exists()) return null;

      return {
        id: docSnap.id,
        person: personADoc.exists() ? "Person A" : "Person B",
        ...docSnap.data()
      } as DogCollar;
    },
  });
};

export const useAddDogCollar = () => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, Omit<DogCollar, "id">>({
    mutationFn: async (data) => {
      const collectionName = data.person === "Person A" ? COLLECTION_NAMES.PERSON_A : COLLECTION_NAMES.PERSON_B;
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        timestamp: new Date().toISOString()
      });
      return docRef.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dog-collars"] });
    },
  });
};

export const useUpdateDogCollar = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, DogCollar>({
    mutationFn: async (data) => {
      const collectionName = data.person === "Person A" ? COLLECTION_NAMES.PERSON_A : COLLECTION_NAMES.PERSON_B;
      await updateDoc(doc(db, collectionName, data.id), {
        ...data,
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dog-collars"] });
      queryClient.invalidateQueries({ queryKey: ["dog-collar", variables.id] });
    },
  });
};

export const useDeleteDogCollar = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; person: string }>({
    mutationFn: async ({ id, person }) => {
      const collectionName = person === "Person A" ? COLLECTION_NAMES.PERSON_A : COLLECTION_NAMES.PERSON_B;
      await deleteDoc(doc(db, collectionName, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dog-collars"] });
    },
  });
};

// Removed useRecentPersonA and useRecentPersonB as they're no longer needed
