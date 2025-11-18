import { ref, get, onValue, off } from 'firebase/database';
import { rtdb } from '../firebase';

type PersonData = {
  visits: number;
  proximity: number;
  total_time: number;
};

export const getPersonVisits = async (personId: 'PersonA' | 'PersonB'): Promise<PersonData | null> => {
  try {
    const snapshot = await get(ref(rtdb, personId));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error(`Error fetching ${personId} visits:`, error);
    return null;
  }
};

export const getVisitsData = async () => {
  const [personA, personB] = await Promise.all([
    getPersonVisits('PersonA'),
    getPersonVisits('PersonB')
  ]);

  return {
    personA: personA || { visits: 0, proximity: 0, total_time: 0 },
    personB: personB || { visits: 0, proximity: 0, total_time: 0 }
  };
};

// Realtime listener for visits
export const onVisitsUpdate = (callback: (data: { personA: PersonData; personB: PersonData }) => void) => {
  const personARef = ref(rtdb, 'PersonA');
  const personBRef = ref(rtdb, 'PersonB');

  const onValueChange = () => {
    getVisitsData().then(callback);
  };

  // Set up listeners
  const unsubscribeA = onValue(personARef, onValueChange);
  const unsubscribeB = onValue(personBRef, onValueChange);

  // Return cleanup function
  return () => {
    unsubscribeA();
    unsubscribeB();
  };
};
