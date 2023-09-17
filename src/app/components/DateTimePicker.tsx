"use client";
import { DatePicker, TimeField } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { useState, useEffect } from "react";
import { convertTimeToUNIX } from "../helpers/unixHelpers";
import debounce from "@/app/helpers/debounce";

export default function DateTimePicker({
  setUnix,
  defaultValue,
}: {
  setUnix: React.Dispatch<React.SetStateAction<number>>;
  defaultValue: Dayjs;
}) {
  const [date, setDate] = useState<Dayjs>(defaultValue);
  const [time, setTime] = useState<Dayjs>(defaultValue);
  const handleDateChange = (newValue: Dayjs | null) => {
    if (!newValue) return;
    setDate((prevValue) => {
      return newValue;
    });
  };

  function handleTimeChange(newValue: Dayjs | null) {
    if (!newValue) return;
    setTime((prevValue) => {
      return newValue;
    });
  }

  const debounceHandleDateChange = debounce(handleDateChange, 2000);
  const debounceHandleTimeChange = debounce(handleTimeChange, 2000);

  useEffect(() => {
    setUnix(convertTimeToUNIX(date, time));
  }, [date, time, setUnix]);

  return (
    <>
      <DatePicker
        value={dayjs(date)}
        onChange={(newValue) => debounceHandleDateChange(newValue)}
      />
      <TimeField
        value={dayjs(time)}
        onChange={(newValue) => debounceHandleTimeChange(newValue)}
      />
    </>
  );
}
