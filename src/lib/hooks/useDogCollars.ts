import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export const useDogCollars = () => {
  return useQuery<DogCollar[], Error>({
    queryKey: ["dog-collars"],
    queryFn: async () => {
      const [personADocs, personBDocs] = await Promise.all([
        getDocs(query(collection(db, COLLECTION_NAMES.PERSON_A), orderBy("timestamp", "desc"))),
        getDocs(query(collection(db, COLLECTION_NAMES.PERSON_B), orderBy("timestamp", "desc")))
      ]);

      // Map and add person identifier to each document
      const personAData = personADocs.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          person: "Person A",
          ...data,
          // Ensure timestamp is a Date object for consistent sorting
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp,
          near_time_start: data.near_time_start?.toDate ? data.near_time_start.toDate() : data.near_time_start,
          near_time_end: data.near_time_end?.toDate ? data.near_time_end.toDate() : data.near_time_end,
          // Ensure total_time is properly handled (it might come as totalTime from Firestore)
          total_time: data.total_time ?? data.totalTime ?? 0,
          // Ensure other numeric fields are properly handled
          visits: data.visits ?? 0,
          proximity: data.proximity ?? 0
        };
      });

      const personBData = personBDocs.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          person: "Person B",
          ...data,
          // Ensure timestamp is a Date object for consistent sorting
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp,
          near_time_start: data.near_time_start?.toDate ? data.near_time_start.toDate() : data.near_time_start,
          near_time_end: data.near_time_end?.toDate ? data.near_time_end.toDate() : data.near_time_end,
          // Ensure total_time is properly handled (it might come as totalTime from Firestore)
          total_time: data.total_time ?? data.totalTime ?? 0,
          // Ensure other numeric fields are properly handled
          visits: data.visits ?? 0,
          proximity: data.proximity ?? 0
        };
      });

      // Merge both arrays and sort by timestamp in descending order
      const mergedData = [...personAData, ...personBData].sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return dateB - dateA; // Sort in descending order (newest first)
      });

      return mergedData as DogCollar[];
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
