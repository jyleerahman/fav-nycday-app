import { create } from 'zustand';

type RouteData = object | null;

interface RouteState {
    route: RouteData;
    setRoute: (routeData: RouteData) => void;
    clearRoute: () => void;
}

export const useRouteStore = create<RouteState>((set) => ({
    route: null,
    setRoute: (routeData) => set({ route: routeData }),
    clearRoute: () => set({ route: null })
}))