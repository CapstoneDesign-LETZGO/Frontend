import { create } from 'zustand';
import { PlaceDto } from '../interfaces/MapInterface';

interface PlaceStore {
    selectedPlace: PlaceDto | null;
    setSelectedPlace: (place: PlaceDto) => void;
    clearSelectedPlace: () => void;
}

export const usePlaceStore = create<PlaceStore>((set) => ({
    selectedPlace: null,
    setSelectedPlace: (place) => set({ selectedPlace: place }),
    clearSelectedPlace: () => set({ selectedPlace: null }),
}));
