import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  getRecentPersonA,
  getRecentPersonB,
} from "../services/firestore";
import type { DogCollar } from "@/types";

const COLLECTION_NAME = "dog-collars";

export const useDogCollars = () => {
  return useQuery<DogCollar[], Error>({
    queryKey: [COLLECTION_NAME],
    queryFn: () => getCollection<DogCollar>(COLLECTION_NAME),
  });
};

export const useDogCollar = (id: string) => {
  return useQuery<DogCollar | null, Error>({
    queryKey: [COLLECTION_NAME, id],
    queryFn: () => getDocument<DogCollar>(COLLECTION_NAME, id),
  });
};

export const useAddDogCollar = () => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, Omit<DogCollar, "id">>({
    mutationFn: (data) => addDocument<Omit<DogCollar, "id">>(COLLECTION_NAME, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTION_NAME] });
    },
  });
};

export const useUpdateDogCollar = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, DogCollar>({
    mutationFn: (data) => updateDocument<DogCollar>(COLLECTION_NAME, data.id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [COLLECTION_NAME] });
      queryClient.invalidateQueries({ queryKey: [COLLECTION_NAME, variables.id] });
    },
  });
};

export const useDeleteDogCollar = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteDocument(COLLECTION_NAME, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTION_NAME] });
    },
  });
};

export const useRecentPersonA = <T>() => {
  return useQuery<T[], Error>({
    queryKey: ["PersonA", "recent"],
    queryFn: () => getRecentPersonA<T>(),
  });
};

export const useRecentPersonB = <T>() => {
  return useQuery<T[], Error>({
    queryKey: ["PersonB", "recent"],
    queryFn: () => getRecentPersonB<T>(),
  });
};
