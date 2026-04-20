import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LocationState {
  lon: number | null;
  lat: number | null;
  setLocation: (lon: number, lat: number) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    set => ({
      lon: null,
      lat: null,

      setLocation: (lon, lat) => set({ lon, lat }),
      clearLocation: () => set({ lon: null, lat: null }),
    }),
    {
      name: 'user-location-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
