import { useQuery } from "@tanstack/react-query";
import { fetchQuakes } from "../api/usgs";
import type { TimeWindow } from "../types";

export function useQuakes(window: TimeWindow) {
  return useQuery({
    queryKey: ["quakes", window],
    queryFn: () => fetchQuakes(window),
    staleTime: 5 * 60 * 1000,     // 5 min
    gcTime: 30 * 60 * 1000,       // 30 min
    refetchOnWindowFocus: false,
  });
}
