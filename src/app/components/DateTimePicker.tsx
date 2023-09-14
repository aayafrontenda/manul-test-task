"use client";
import { DatePicker, TimeField } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { useState, useEffect } from "react";
import { convertTimeToUNIX } from "../helpers/unixHelpers";

export default function DateTimePicker({
  setUnix,
}: {
  setUnix: React.Dispatch<React.SetStateAction<number | undefined>>;
}) {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [time, setTime] = useState<Dayjs | null>(null);
  const [debouncedTime, setDebouncedTime] = useState<Dayjs | null>(null);
  const [dateRefresh, setDateRefresh] = useState<boolean>(false);
  const [timeRefresh, setTimeRefresh] = useState<boolean>(false);

  const handleDateChange = (newValue: Dayjs | null) => {
    if (!newValue) return;
    setDate((prevValue) => {
      /* console.log(
        "convertTimeToUNIX(prevValue, null)",
        convertTimeToUNIX(prevValue, dayjs(0))
      );
      console.log(
        "convertTimeToUNIX(newValue, null)",
        convertTimeToUNIX(newValue, dayjs(0))
      );
      */
      if (
        convertTimeToUNIX(prevValue, dayjs(0)) !==
        convertTimeToUNIX(newValue, dayjs(0))
      ) {
        setDateRefresh(true);
      }
      return newValue;
    });
  };

  const handleTimeChange = (newValue: Dayjs | null) => {
    if (!newValue) return;
    setTime((prevValue) => {
      if (
        convertTimeToUNIX(dayjs(0), prevValue) !==
        convertTimeToUNIX(dayjs(0), newValue)
      ) {
        setTimeRefresh(true);
      }
      return newValue;
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedTime(time);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [time, 500]);

  useEffect(() => {
    if (timeRefresh && dateRefresh) {
      setUnix(convertTimeToUNIX(date, time));
      // setTimeRefresh(false);
      // setDateRefresh(false);
    }
  }, [timeRefresh, dateRefresh, date, time, setUnix]);

  return (
    <>
      <DatePicker
        value={dayjs(date)}
        onChange={(newValue) => handleDateChange(newValue)}
      />
      <TimeField
        value={dayjs(time)}
        onChange={(newValue) => handleTimeChange(newValue)}
      />
    </>
  );
}
