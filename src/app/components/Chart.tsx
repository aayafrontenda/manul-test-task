import React, {
  useRef,
  useLayoutEffect,
  useEffect,
  useState,
  Suspense,
} from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { FuelRecord, Interval, IntervalData } from "../Types/types";
import { convertTimeFromUNIX, convertTimeToUNIX } from "../helpers/unixHelpers";
import { useData } from "../context/DataContext";
import dayjs, { Dayjs } from "dayjs";
import { getWeek } from "@amcharts/amcharts5/.internal/core/util/Utils";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Chart({
  timeStampBegin,
  timeStampEnd,
  interval,
}: {
  timeStampBegin: number | undefined;
  timeStampEnd: number | undefined;
  interval: Interval;
}) {
  // const [data, setData] = useState([]);
  const { data, setData } = useData();
  let intervalData = useRef<Record<string, IntervalData>>({});
  useEffect(() => {
    fetch(
      `http://188.94.158.122:8080/transporttelemetry/get/coordsOverTime?rigId=36&timeStampBegin=${timeStampBegin}&timeStampEnd=${timeStampEnd}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "manul/test",
        },
      }
    )
      .then((response) => response.json()) // Convert response to JSON
      .then((data) => setData(data)); // Log the JSON data
  }, [setData, timeStampBegin, timeStampEnd]);

  useEffect(() => {
    // console.log("timeStampBegin", timeStampBegin);
  }, [timeStampBegin]);

  useEffect(() => {
    console.log("interval", interval);
    if (interval === "day") {
      intervalData.current = {};
      data.forEach((fuelRecord) => {
        const dayOfTheYear = convertTimeFromUNIX(fuelRecord.timeStart).format(
          "DD/MM/YYYY"
        );
        if (!intervalData.current[dayOfTheYear]) {
          intervalData.current[dayOfTheYear] = {
            interval: dayOfTheYear,
            fuel1Sum: 0,
            fuel2Sum: 0,
            fuel1Count: 0,
            fuel2Count: 0,
            fuelTotalSum: 0,
            fuelTotalCount: 0,
          };
        }
        intervalData.current[dayOfTheYear].fuel1Count++;
        intervalData.current[dayOfTheYear].fuel2Count++;
        intervalData.current[dayOfTheYear].fuelTotalCount++;
        intervalData.current[dayOfTheYear].fuel1Sum += fuelRecord.fuelLevel;
        intervalData.current[dayOfTheYear].fuel2Sum += fuelRecord.fuelLevel2;
        intervalData.current[dayOfTheYear].fuelTotalSum +=
          fuelRecord.fuelLevel + fuelRecord.fuelLevel2;
      });
    } else if (interval === "week") {
      intervalData.current = {};
      // console.log("here");
      data.forEach((fuelRecord) => {
        const year = convertTimeFromUNIX(fuelRecord.timeStart).year();
        const weekOfTheYear = getWeek(
          convertTimeFromUNIX(fuelRecord.timeStart).toDate()
        );
        const firstWeekDay = dayjs()
          .year(year)
          .startOf("year")
          .add(weekOfTheYear - 1, "week")
          .add(1, "day")
          .toDate();
        const lastWeekDay = dayjs()
          .year(year)
          .startOf("year")
          .add(weekOfTheYear - 1, "week")
          .add(7, "day")
          .toDate();
        // console.log("weekOfYear", weekOfTheYear);
        if (!intervalData.current[weekOfTheYear]) {
          intervalData.current[weekOfTheYear] = {
            interval: `${dayjs(firstWeekDay).format("DD/MM/YYYY")}-${dayjs(
              lastWeekDay
            ).format("DD/MM/YYYY")}`,
            fuel1Sum: 0,
            fuel2Sum: 0,
            fuel1Count: 0,
            fuel2Count: 0,
            fuelTotalSum: 0,
            fuelTotalCount: 0,
          };
        }
        intervalData.current[weekOfTheYear].fuel1Count++;
        intervalData.current[weekOfTheYear].fuel2Count++;
        intervalData.current[weekOfTheYear].fuelTotalCount++;
        intervalData.current[weekOfTheYear].fuel1Sum += fuelRecord.fuelLevel;
        intervalData.current[weekOfTheYear].fuel2Sum += fuelRecord.fuelLevel2;
        intervalData.current[weekOfTheYear].fuelTotalSum +=
          fuelRecord.fuelLevel + fuelRecord.fuelLevel2;
      });
      console.log("weekData", intervalData.current);
    } else if (interval === "month") {
      intervalData.current = {};
      data.forEach((fuelRecord) => {
        const date = convertTimeFromUNIX(fuelRecord.timeStart);
        const monthOfTheYear = `${months[date.month()]} ${date.year()}`;
        // console.log("weekOfYear", weekOfTheYear);
        if (!intervalData.current[monthOfTheYear]) {
          intervalData.current[monthOfTheYear] = {
            interval: monthOfTheYear,
            fuel1Sum: 0,
            fuel2Sum: 0,
            fuel1Count: 0,
            fuel2Count: 0,
            fuelTotalSum: 0,
            fuelTotalCount: 0,
          };
        }
        intervalData.current[monthOfTheYear].fuel1Count++;
        intervalData.current[monthOfTheYear].fuel2Count++;
        intervalData.current[monthOfTheYear].fuelTotalCount++;
        intervalData.current[monthOfTheYear].fuel1Sum += fuelRecord.fuelLevel;
        intervalData.current[monthOfTheYear].fuel2Sum += fuelRecord.fuelLevel2;
        intervalData.current[monthOfTheYear].fuelTotalSum +=
          fuelRecord.fuelLevel + fuelRecord.fuelLevel2;
      });
    } else if (interval === "year") {
      intervalData.current = {
        "2022": {
          interval: "2022",
          fuel1Sum: 0,
          fuel2Sum: 0,
          fuel1Count: 1,
          fuel2Count: 1,
          fuelTotalSum: 0,
          fuelTotalCount: 1,
        },
      };
      data.forEach((fuelRecord) => {
        const year = convertTimeFromUNIX(fuelRecord.timeStart)
          .year()
          .toString();
        // console.log("weekOfYear", weekOfTheYear);
        if (!intervalData.current[year]) {
          intervalData.current[year] = {
            interval: year,
            fuel1Sum: 0,
            fuel2Sum: 0,
            fuel1Count: 0,
            fuel2Count: 0,
            fuelTotalSum: 0,
            fuelTotalCount: 0,
          };
        }
        intervalData.current[year].fuel1Count++;
        intervalData.current[year].fuel2Count++;
        intervalData.current[year].fuelTotalCount++;
        intervalData.current[year].fuel1Sum += fuelRecord.fuelLevel;
        intervalData.current[year].fuel2Sum += fuelRecord.fuelLevel2;
        intervalData.current[year].fuelTotalSum +=
          fuelRecord.fuelLevel + fuelRecord.fuelLevel2;
      });
      console.log("yearData", intervalData.current);
    }
  }, [data, interval]);

  useEffect(() => {
    let root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panY: false,
        layout: root.verticalLayout,
      })
    );

    let hourglass;
    setTimeout(() => {
      hourglass = indicator.children.push(
        am5.Graphics.new(root, {
          width: 32,
          height: 32,
          fill: am5.color(0x000000),
          x: am5.p50,
          y: am5.p50,
          centerX: am5.p50,
          centerY: am5.p50,
          dy: -45,
          svgPath:
            "M12 5v10l9 9-9 9v10h24V33l-9-9 9-9V5H12zm20 29v5H16v-5l8-8 8 8zm-8-12-8-8V9h16v5l-8 8z",
        })
      );

      var hourglassanimation = hourglass.animate({
        key: "rotation",
        to: 180,
        loops: Infinity,
        duration: 2000,
        easing: am5.ease.inOut(am5.ease.cubic),
      });
    }, 500);

    let dataSet;
    if (interval === "all") {
      dataSet = data.map((fuelRecord) => {
        return {
          category: convertTimeFromUNIX(fuelRecord.timeStart).format(
            "DD/MM HH:mm"
          ),
          value1: fuelRecord.fuelLevel,
          value2: fuelRecord.fuelLevel2,
          value3: fuelRecord.fuelLevel + fuelRecord.fuelLevel2,
        };
      });
    } else {
      dataSet = Object.keys(intervalData.current as Object).map((key) => {
        const record = intervalData.current[key];
        return {
          /*
        category: convertTimeFromUNIX(Fuelrecord.timeStart).format(
          "DD/MM HH:mm"
        ),
        */
          category: record.interval,
          value1: record.fuel1Sum / record.fuel1Count,
          value2: record.fuel2Sum / record.fuel2Count,
          value3: record.fuelTotalSum / record.fuelTotalCount,
        };
      });
    }

    // Create Y-axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Create X-Axis

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
        categoryField: "category",
      })
    );

    xAxis.data.setAll(dataSet);

    const names = ["Топливо 1", "Топливо 2", "Топливо 1 + Топливо 2"];

    for (let i = 0; i < 3; i++) {
      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: names[i],
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: `value${i + 1}`,
          categoryXField: "category",
        })
      );

      series.fills.template.set(
        "fillGradient",
        am5.LinearGradient.new(root, {
          stops: [
            {
              opacity: 0.1,
            },
            {
              opacity: 0.05,
            },
          ],
          rotation: 90,
        })
      );

      series.fills.template.setAll({
        visible: true,
        fillOpacity: 1,
      });

      series.strokes.template.setAll({
        strokeWidth: 2,
      });
      series.data.setAll(dataSet);
    }
    /*
      series.bullets.push(function (root) {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 1,
            fill: series.get("fill"),
          }),
        });
      });
    
    */
    // Create series
    /* let series1 = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value1",
        categoryXField: "category",
      })
    );
    series1.data.setAll(dataSet);

    let series2 = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value2",
        categoryXField: "category",
    })
    );
    series2.data.setAll(dataSet);
    
    series2.bullets.push(function (root) {
        return am5.Bullet.new(root, {
            sprite: am5.Circle.new(root, {
          radius: 1,
          fill: series2.get("fill"),
        }),
      });
    });

    series1.bullets.push(function (root) {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 1,
          fill: series1.get("fill"),
        }),
    });
    });
    */
    // am5core.options.onlyShowOnViewport = true;
    // Add legend
    let legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {}));
    let indicator = root.container.children.push(
      am5.Container.new(root, {
        width: am5.p100,
        height: am5.p100,
        layer: 1000,
        background: am5.Rectangle.new(root, {
          fill: am5.color(0xffffff),
          fillOpacity: 0.7,
        }),
      })
    );

    am5.ready(function () {
      indicator.hide();
    });

    return () => {
      root.dispose();
    };
  }, [data, interval]);

  return <div id="chartdiv" className="w-full h-[300px]"></div>;
}
export default Chart;
