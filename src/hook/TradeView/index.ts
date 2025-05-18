import { getKlinesData } from "@/api/service/exchange/exchange";
import { RootState } from "@/store";
import { IKlineData } from "./types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { transformKlineData } from "./utils";
import worker from "@/workers";
import { UTCTimestamp } from "lightweight-charts";

export default function useKlineData() {
    const [KlineData, setKlineData] = useState<IKlineData[]>([]);
    const [WsKlineData, setWsKlineData] = useState<IKlineData>({
        time: 0  as UTCTimestamp,
        open: 0,
        high: 0,
        low: 0,
        close: 0,
    });

    const uppercaseSymbol = useSelector((state: RootState) => {
        return state.symbolNameMap.uppercaseSymbol;
    });

    const lowercaseSymbol = useSelector((state: RootState) => {
        return state.symbolNameMap.lowercaseSymbol;
    });

    useEffect(() => {
        const getKlinesDataIn = async () => {
            const res = await getKlinesData({
                symbol: uppercaseSymbol,
                interval: "1d",
                limit: 1000,
                startTime: 1672531200000,
            });
            if (res.success) {
                setKlineData(transformKlineData(res.data))
            }

            worker.postMessage({
                type: "kline",
                url: `wss://stream.binance.com:9443/ws/${lowercaseSymbol}@kline_1d`,
            });

            return res.success ? transformKlineData(res.data) : []
        };

        const handleWsKlineData = (response: MessageEvent) => {
            const { type, data } = response.data
            if (type !== "kline") return;
            setWsKlineData(data)
        }

        getKlinesDataIn()
        worker.subscribe(handleWsKlineData)
        return () => worker.destroy(handleWsKlineData);
    }, [uppercaseSymbol])

    return { KlineData, WsKlineData }
}