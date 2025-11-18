import { Timestamp } from "firebase/firestore";

export type DogCollar = {
  id: string;
  person: string;
  near_time_start?: Timestamp | Date | string;
  near_time_end?: Timestamp | Date | string;
  visits?: number;
  proximity?: number;
  total_time?: number;
  timestamp?: Timestamp | Date | string;
  name?: string;
};