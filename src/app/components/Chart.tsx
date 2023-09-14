import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { FuelRecord, Interval, IntervalData } from "../Types/types";
import { convertTimeFromUNIX, convertTimeToUNIX } from "../helpers/unixHelpers";
import { useData } from "../context/DataContext";
import dayjs, { Dayjs } from "dayjs";
import { getWeekYear } from "@amcharts/amcharts5/.internal/core/util/Utils";

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
  }, [timeStampBegin, timeStampEnd]);

  useEffect(() => {
    if (interval === "day") {
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
      data.forEach((fuelRecord) => {
        const weekOfTheYear =
          convertTimeFromUNIX(fuelRecord.timeStart).year() +
          "/" +
          getWeekYear(convertTimeFromUNIX(fuelRecord.timeStart).toDate());
        if (!intervalData.current[weekOfTheYear]) {
          intervalData.current[weekOfTheYear] = {
            interval: weekOfTheYear,
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

    let dataSet = Object.keys(intervalData.current as Object).map((key) => {
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
              opacity: 1,
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

    return () => {
      root.dispose();
    };
  }, [data, intervalData]);

  return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
}
export default Chart;
