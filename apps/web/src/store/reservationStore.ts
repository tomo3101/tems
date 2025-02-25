import { create } from 'zustand';

export type ReservationData = {
  eventId: number;
  date: string;
  startTime: string;
  endTime: string;
  numberOfPeople: number;
};

type ReservationStore = {
  data: ReservationData;
  setData: (data: ReservationData) => void;
  reset: () => void;
};

export const useReservationStore = create<ReservationStore>((set) => ({
  data: {
    eventId: 0,
    date: '',
    startTime: '',
    endTime: '',
    numberOfPeople: 1,
  },
  setData: (data) => set({ data }),
  reset: () =>
    set({
      data: {
        eventId: 0,
        date: '',
        startTime: '',
        endTime: '',
        numberOfPeople: 1,
      },
    }),
}));
