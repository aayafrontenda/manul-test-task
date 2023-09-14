"use client";
import { data } from "autoprefixer";
import { createContext, useContext, useState } from "react";
import { DataContextType, DataProviderProps, FuelRecord } from "../Types/types";

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }: DataProviderProps) => {
  const [data, setData] = useState<FuelRecord[]>([]);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};
