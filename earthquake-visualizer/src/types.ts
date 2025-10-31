export type Quake = {
  id: string;
  mag: number;
  time: number;            // epoch ms
  depthKm: number;
  coords: { lat: number; lng: number };
  place: string;
  url: string;
};

export type TimeWindow = "hour" | "day" | "week";
