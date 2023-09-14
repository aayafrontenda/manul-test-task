import { Dispatch, ReactNode, SetStateAction } from "react";

export type Interval = "day" | "week" | "month" | "year" | "all";

export interface IntervalData {
  interval: string;
  fuel1Sum: number;
  fuel1Count: number;
  fuel2Sum: number;
  fuel2Count: number;
  fuelTotalSum: number;
  fuelTotalCount: number;
}

export interface Location {
  id: string;
  x: number;
  y: number;
}

export interface FuelRecord {
  id: string;
  timeStart: number;
  location: Location;
  speed: number;
  address: string;
  fuelLevel: number;
  fuelLevel2: number;
  impulse: number;
  pressure: number;
}

export type DataProviderProps = {
  children: ReactNode;
};

export type DataContextType = {
  data: FuelRecord[];
  setData: Dispatch<SetStateAction<FuelRecord[]>>;
};
