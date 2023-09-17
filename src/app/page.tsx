"use client";
import React, { useState, useEffect, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { lightGreen, green } from "@mui/material/colors";
import "dayjs/locale/ru";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlagCheckered,
  faFontAwesome,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import DateTimePicker from "./components/DateTimePicker";
import { convertTimeFromUNIX } from "./helpers/unixHelpers";
import { useData } from "./context/DataContext";
import { Interval } from "./Types/types";
import ChartComponent from "./components/ChartComponent";
import Chart from "./components/Chart";

const LazyChart = lazy(() => import("./components/ChartComponent"));

const theme = createTheme({
  palette: {
    primary: lightGreen,
    secondary: green,
  },
});

export default function FuelMonitor() {
  const [startUnix, setStartUnix] = useState<number>(1693072800000);
  // 1693677518000
  // 1693072800000
  const [endUnix, setEndUnix] = useState<number>(1693677599999);
  const [interval, setInterval] = useState<Interval>("day");

  useEffect(() => {
    // console.log("startUnix", startUnix);
    if (!startUnix) return;
    // console.log("startDate", convertTimeFromUNIX(startUnix));
  }, [startUnix]);

  useEffect(() => {
    // console.log("endUnix", endUnix);
    if (!endUnix) return;
    // console.log("endDate", convertTimeFromUNIX(endUnix));
  }, [endUnix]);

  const { data } = useData();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <ThemeProvider theme={theme}>
        <h1 className="font-semibold text-3xl mb-4">Отслеживание топлива</h1>
        <div className="w-full h-full rounded-2xl flex flex-col gap-4 p-4 lg:p-12 bg-white text-gray-800">
          <div className="flex">
            <span>
              <h4 className="font-semibold text-lg text-gray-500">
                Всего записей
              </h4>
              <h4 className="font-bold text-2xl">{data.length}</h4>
            </span>
            <div className="ml-auto p-1 rounded-xl bg-gray-200 flex gap-1">
              <button
                className={`p-4 rounded-xl hover:bg-white hover:text-gray-800 font-bold text-gray-600 transition-all duration-200 ${
                  interval === "day" ? "bg-white text-gray-800" : ""
                }`}
                onClick={() => setInterval("day")}
              >
                По дням
              </button>
              <button
                className={`p-4 rounded-xl hover:bg-white hover:text-gray-800 font-bold text-gray-600 transition-all duration-200 ${
                  interval === "week" ? "bg-white text-gray-800" : ""
                }`}
                onClick={() => setInterval("week")}
              >
                По неделям
              </button>
              <button
                className={`p-4 rounded-xl hover:bg-white hover:text-gray-800 font-bold text-gray-600 transition-all duration-200 ${
                  interval === "month" ? "bg-white text-gray-800" : ""
                }`}
                onClick={() => setInterval("month")}
              >
                По месяцам
              </button>
              <button
                className={`p-4 rounded-xl hover:bg-white hover:text-gray-800 font-bold text-gray-600 transition-all duration-200 ${
                  interval === "year" ? "bg-white text-gray-800" : ""
                }`}
                onClick={() => setInterval("year")}
              >
                По годам
              </button>
              <button
                className={`p-4 rounded-xl hover:bg-white hover:text-gray-800 font-bold text-gray-600 transition-all duration-200 ${
                  interval === "all" ? "bg-white text-gray-800" : ""
                }`}
                onClick={() => setInterval("all")}
              >
                Все данные
              </button>
            </div>
          </div>
          <div className="flex w-full items-center gap-8 justify-center">
            <div className="flex gap-4 m-0 items-center">
              <h4 className="text-xl font-medium">
                <FontAwesomeIcon
                  icon={faFontAwesome}
                  className="ml-2 text-gray-500 text-2xl"
                />
              </h4>
              <DateTimePicker
                setUnix={setStartUnix}
                defaultValue={convertTimeFromUNIX(startUnix)}
              />
            </div>
            <FontAwesomeIcon icon={faArrowRight} className="text-2xl" />
            <div className="flex gap-4 m-0 p-0 items-center">
              <DateTimePicker
                setUnix={setEndUnix}
                defaultValue={convertTimeFromUNIX(endUnix)}
              />
              <h4 className="text-xl font-medium">
                <FontAwesomeIcon
                  icon={faFlagCheckered}
                  className="ml-2 text-gray-500 text-2xl"
                />
              </h4>
            </div>
          </div>
          <Chart
            timeStampBegin={startUnix}
            timeStampEnd={endUnix}
            interval={interval}
          />
        </div>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
