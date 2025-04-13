import { useEffect, useRef } from "react";
import { getKlinesData } from "@/api/service/exchange";
import { createChart, LineSeries } from "lightweight-charts";

function convertBinanceKlineToChart(data: any[][]) {
    return data.map((item, index) => ({
      time: `${2018 + index}-12-12`,  // 轉換成秒為單位
      value :parseFloat(item[1]),
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    }));
}

export default function TradeView() {
  const chartContainerRef = useRef<HTMLDivElement>(null); // 這裡取得 DOM
  let isRender = false;

  useEffect(() => {
    const getKlinesDataIn = async () => {
      const res = await getKlinesData({
        symbol: "BTCUSDT",
        interval: "1m",
      });
        console.log("res", res);
      if (!chartContainerRef.current || isRender) return;
      const chart = createChart(chartContainerRef.current, {
        width: 800,
        height: 600,
      });
      const lineSeries = chart.addSeries(LineSeries);
      const data = convertBinanceKlineToChart(res.data)
      lineSeries.setData(data);
      isRender = true;
    };

    getKlinesDataIn();
  }, []);

  return (
    <div className="" ref={chartContainerRef}>
      <div className=""></div>
    </div>
  );
}
