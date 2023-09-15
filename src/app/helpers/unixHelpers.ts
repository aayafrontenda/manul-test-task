import dayjs, { Dayjs } from "dayjs";

export function convertTimeToUNIX(date: Dayjs | null, time: Dayjs | null) {
  if (!date || !time) return -1;
  console.log("date", date);
  console.log("time", time);
  let result = date
    .minute(0)
    .hour(0)
    .add(time.hour(), "hours")
    .add(time.minute(), "minutes");
  console.log("result", result);
  return result.unix() * 1000;
}

export function convertTimeFromUNIX(unix: number) {
  /*
  console.log("unix", unix);
  console.log("dayjs.unix(unix)", dayjs.unix(unix / 1000));
  console.log(
    `dayjs.unix(unix).format("DD/MM HH:mm")`,
    dayjs.unix(unix / 1000).format("DD/MM HH:mm")
  );
  */
  return dayjs.unix(unix / 1000);
}
