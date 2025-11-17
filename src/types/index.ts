export type DataRow = {
  person: string;
  visit: number;
  proximity: 'near' | 'far';
  near_time_start: string;
  near_time_end: string;
};
