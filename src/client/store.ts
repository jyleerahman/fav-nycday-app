import { create } from 'zustand';

export const useAppStore = create((set) => ({
    currentRoute: null,
    setCurrentRoute: (route) => set({ currentRoute: route }),
    currentWaypoints: [],
    setCurrentWaypoints: (waypoints) => set({ currentWaypoints: waypoints })
}))

