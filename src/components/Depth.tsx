import { getDepthData } from "@/api/service/exchange";
import { useEffect, useState } from "react";
import CTable from "./table";
import { formatNumToFixed } from "@/utils";
import { DepthResponse, DepthTable } from "@/types";


export default function Depth() {
  const tableHeader = [
    {
      label: "價格 (USDT)",
      key: "price",
      format: (val: string) => formatNumToFixed(val),
      getStyle: (val: string) => ({
        color: "red",
      }),
    },

    {
      label: "數量(BTC)",
      key: "volume",
      format: (val: string) => formatNumToFixed(val, 5),
    },
    {
      label: "成交額",
      key: "amount",
    },
  ];
  const [askData, setAskData] = useState<DepthTable[]>([]);
  const [bidsData, setBidsData] = useState([]);
  const [rowStyle, setRowStyle] = useState({})

  function handleDepthData(depthData: string[][]): DepthTable[] {
    // const maxPrice = Math.max(...);
    return depthData.map((item) => {
      return {
        price: item[0],
        volume: item[1],
        amount: Number(item[0]) * Number(item[1]),
        // ratio 
      };
    });
  }

  useEffect(() => {
    const getDepthDataIn = async () => {
      const res = await getDepthData();
      const askData = handleDepthData(res.data.asks);
      setAskData(askData.slice(0, 20));
      setRowStyle({
        backgroundColor:' red'
      })
      console.log("res", res);
      console.log("askData", askData);
    };

    getDepthDataIn();
  }, []);
  return (
    <div className="">
      <div className="">
        <p>委託訂單</p>
      </div>
      <CTable columnData={tableHeader} rowData={askData} rowStyle={rowStyle}/>
    </div>
  );
}
