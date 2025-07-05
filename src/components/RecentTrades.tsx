import { getRecentTrades } from "@/api/service/exchange/exchange";
import { IRecentTradesResponse } from "@/api/service/exchange/responseTypes";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import { RootState } from "@/store";
import { formatNumToFixed } from "@/utils";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CTable from "./table";
import CTabs, { ITabData } from "./tabs";
import worker from "@/workers";

function RecentTrades() {
    const [recentTrades, setRecentTrades] = useState<IRecentTradesResponse[]>([]);

    const { lowercaseSymbol, uppercaseSymbol } = useSelector((state: RootState) => {
        return state.symbolNameMap;
    });

    const currSymbolInfo: ISymbolInfoWithPrecision = useSelector(
        (state: RootState) => {
            return state.symbolInfoList.currentSymbolInfo;
        }
    );

    const {
        baseAsset,
        quoteAsset,
        showPrecision
    } = currSymbolInfo;

    const columns = [
        {
            label: `價格(${quoteAsset})`,
            key: "price",
            render: (content: number, item: IRecentTradesResponse, columnIndex: number) => {
                return <div className={`${item.isBuyerMaker ? 'text-rise' : 'text-fall'}`}>
                    {formatNumToFixed(item.price, showPrecision)}
                </div>

            }
        },
        {
            label: `數量(${baseAsset})`,
            key: "qty",
            render: (content: number, item: IRecentTradesResponse, columnIndex: number) => {
                return <div className={`${item.isBuyerMaker ? 'text-rise' : 'text-fall'}`}>
                    {formatNumToFixed(item.qty, showPrecision)}
                </div>
            },
        },
        {
            label: '時間',
            key: "time",
            format: (val: number) => dayjs(val).format('HH:mm:ss'),
        }
    ];

    const tabs = [
        {
            label: '最近成交',
            index: 0,
        },
        // {
        //     label: '我的成交',
        //     index: 1,
        // }
    ]

    const handleTabChange = (item: ITabData) => {
        console.log(item);
    }

    useEffect(() => {
        const getRecentTradesIn = async () => {
            const res = await getRecentTrades({ symbol: uppercaseSymbol });
            setRecentTrades(res.data);

            worker.postMessage({
                type: "trades",
                param: [`${lowercaseSymbol}@trade`],
            });
        }

        function handleWsTrades(response: MessageEvent) {
            const { type, data } = response.data;
            if (type === "trades") {
                setRecentTrades((prev) => [data, ...prev.slice(0, 49)]);
            }
        }

        getRecentTradesIn();
        worker.subscribe(handleWsTrades);

        return () => worker.destroy(handleWsTrades);
    }, [uppercaseSymbol, lowercaseSymbol]);

    return <>
        <div className="h-[calc(100%-91px)]">
            <div className="p-5px">
                <CTabs tabData={tabs} tabOnChange={handleTabChange}></CTabs>
            </div>
            <CTable
                virtualed={true}
                trHeight={35}
                columnData={columns}
                rowData={recentTrades}
            />
        </div>
    </>
}

export default RecentTrades;