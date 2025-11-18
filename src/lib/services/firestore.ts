import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  QuerySnapshot,
  DocumentReference,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { db } from "../firebase";

// Generic function to get all documents from a collection
export const getCollection = async <T>(collectionName: string): Promise<T[]> => {
  const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
};

// Generic function to get a single document from a collection
export const getDocument = async <T>(collectionName: string, id: string): Promise<T | null> => {
  const docRef: DocumentReference<DocumentData> = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  } else {
    return null;
  }
};

// Generic function to add a document to a collection
export const addDocument = async <T>(collectionName: string, data: T): Promise<string> => {
  // Add server timestamp to the document
  const docData = {
    ...data,
    timestamp: new Date().toISOString() // Add current timestamp in ISO format
  };
  const docRef: DocumentReference<DocumentData> = await addDoc(collection(db, collectionName), docData as any);
  return docRef.id;
};

// Generic function to update a document in a collection
export const updateDocument = async <T>(collectionName: string, id: string, data: T): Promise<void> => {
  // Add updated timestamp to the document
  const updateData = {
    ...data,
    updatedAt: new Date().toISOString() // Add update timestamp
  };
  const docRef: DocumentReference<DocumentData> = doc(db, collectionName, id);
  await updateDoc(docRef, updateData as any);
};

// Generic function to delete a document from a collection
export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  const docRef: DocumentReference<DocumentData> = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

// Function to get recent PersonA documents
export const getRecentPersonA = async <T>(): Promise<T[]> => {
  const q = query(
    collection(db, "PersonA"),
    orderBy("timestamp", "desc"),
    limit(1)
  );
  const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
};

// Function to get recent PersonB documents
export const getRecentPersonB = async <T>(): Promise<T[]> => {
  const q = query(
    collection(db, "PersonB"),
    orderBy("timestamp", "desc"),
    limit(1)
  );
  const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
};
