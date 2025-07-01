import { Grid, GridItem, Spinner } from "@chakra-ui/react";
import TradingPairHeader from "@/components/TradingPairHeader";
import Depth from "@/components/Depth";
// import TradeView from "@/components/TradeView";
import TradeView from "@/components/_TradeView";
import TradeForm from "@/components/TradeForm";
import "@/App.css";
import Market from "@/components/Market";
import { useEffect, useState } from "react";
import { getSymbolMetaMap } from "@/api/service/exchange/exchange";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  RootState,
  setCurrSymbolInfo,
  setSymbolInfoList,
  setSymbolName,
} from "@/store";
import OrderList from "@/components/OrderList";
import { getCurrentSymbolInfo } from "@/hook/Market/utils";
import { useParams } from "react-router-dom";
import { errorToast } from "@/utils/notify";

function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const symbolInfoList = useSelector((state: RootState) => {
    return state.symbolInfoList.list;
  });

  const isLoading = useSelector((state: RootState) => {
    return state.loading.isLoading;
  });

  const { symbol = "BTCUSDT" } = useParams<{ symbol: string }>();
  const [render, setRender] = useState<boolean>(false);

  useEffect(() => {
    const getSymbolMetaMapIn = async () => {
      const exchangeInfo = await getSymbolMetaMap();
      if (exchangeInfo) {
        const { symbols } = exchangeInfo.data;
        dispatch(setSymbolInfoList(symbols));
      }
    };

    getSymbolMetaMapIn();
  }, [dispatch]);

  // 設定幣種的資訊
  useEffect(() => {
    const currSymbolInfo = getCurrentSymbolInfo(symbol, symbolInfoList);
    if (currSymbolInfo) {
      dispatch(setSymbolName(currSymbolInfo));
      dispatch(setCurrSymbolInfo(currSymbolInfo));
      setRender(true);
    }else if(symbolInfoList.length){
      errorToast('錯誤',`找不到此幣種: ${symbol}`)
    }
  }, [symbolInfoList, dispatch, symbol]);

  return (
    <>
    { isLoading && <div className="w-full h-100% flex items-center justify-center absolute left-0 top-0 z-100 bg-#FFF opacity-50"></div>}
    { isLoading &&
      <div className={`w-full h-100vh flex items-center justify-center absolute left-0 top-0`}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          className="z-100"
        />
      </div>
    }
    {/* 主要畫面內容 */}
      <div className="w-full max-w-1600px mx-auto">
        <Grid
          templateAreas={`
          "left header header Market right"
          "left Depth TradeView Market right"
          "left Depth TradeForm Market right"
          "left OrderList OrderList OrderList right"
          "footer footer footer footer footer "
          `}
          gridTemplateColumns={`
            1fr 
            minmax(253px, 320px)
            minmax(510px, 1080px) 
            minmax(253px, 310px) 
            1fr
          `}
          gridTemplateRows={`    
            56px 
            minmax(500px, 1fr) 
            minmax(320px, 440px) 
            320px
            24px`}
          gap="1"
          color="blackAlpha.700"
          fontWeight="bold"
          w="100%"
          maxH="1610px"
        >
          <GridItem area={"header"} className="bg-#FFFF rd-10px">
            <TradingPairHeader />
          </GridItem>
          <GridItem
            area={"Depth"}
            className="bg-#FFFF rd-10px"
            overflowY={"auto"}
          >
            <Depth />
          </GridItem>
          <GridItem area={"TradeView"} className="bg-#FFFF rd-10px">
            <TradeView />
          </GridItem>
          <GridItem area={"TradeForm"} className="bg-#FFFF rd-10px">
            <TradeForm />
          </GridItem>
          <GridItem area={"OrderList"} className="bg-#FFFF rd-10px">
            <OrderList />
          </GridItem>
          <GridItem
            area={"Market"}
            // overflowY={"auto"}
            className="bg-#FFFF rd-10px"
          >
            <Market />
          </GridItem>
        </Grid>
      </div>


    </>
  );
}

export default Home;
