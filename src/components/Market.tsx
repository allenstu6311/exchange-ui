import $http from "@/api";
import { Ticker24hrStat } from "@/types";
import { useEffect, useState } from "react";
import CTable from "@/components/table";
import { formatNumToFixed } from "@/utils";
import worker from "@/workers";

export default function Market() {
    // console.log('Market');
    

  const [marketData, setMarketData] = useState<Ticker24hrStat[]>([]);
  const tableHeader = [
    {
      label: "交易對",
      key: "symbol",
    },

    {
      label: "最新價",
      key: "askPrice",
      format:(val:string)=>formatNumToFixed(val)
    },
    {
      label: "24h漲跌",
      key: "priceChangePercent",
      format:(val:string)=>formatNumToFixed(val)
    },
  ];

  useEffect(() => {
    const getTickerBy24hr = async () => {
      const res = await $http.get("/ticker/24hr");
      const { status, data } = res;

      if (status === 200) {        
        setMarketData(data);
      }
    };

    worker.postMessage({
        type:'ticker',
        url:'wss://stream.binance.com:9443/ws/!ticker@arr'
    })

    worker.onmessage = (response)=>{
        const { type, data } = response;
        setMarketData(data.data);
    }

    // getTickerBy24hr();
  }, []);

  return (
    <div className="">
      <CTable columnData={tableHeader} rowData={marketData} />
    </div>
  );
}
