import { Grid, GridItem } from "@chakra-ui/react";
import TradingPairHeader from "@/components/TradingPairHeader";
import Depth from "@/components/Depth";
import TradeView from "@/components/TradeView";
import TradeForm from "@/components/TradeForm";
import "@/App.css";
import Market from "@/components/Market";
import { useEffect } from "react";
import { getSymbolMetaMap } from "@/api/service/exchange";
import { useDispatch } from "react-redux";
import { AppDispatch, setExchangeSymbolMeta, setSymbolInfoList } from "@/store";

function Home() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const getSymbolMetaMapIn = async () => {
      const exchangeInfo = await getSymbolMetaMap();
      if (exchangeInfo) {
        const { symbols } = exchangeInfo;
        dispatch(setSymbolInfoList(symbols));
      }
    };

    getSymbolMetaMapIn();
  }, [dispatch]);

  return (
    <>
      <div className="w-full max-w-1800px mx-auto">
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
            minmax(510px, 880px) 
            minmax(253px, 320px) 
            1fr
          `}
          gridTemplateRows={`    
            56px 
            minmax(500px, 1fr) 
            minmax(320px, 500px) 
            320px
            24px`}
          gap="1"
          color="blackAlpha.700"
          fontWeight="bold"
          w="100%"
          maxH="1600px"
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
          <GridItem
            area={"TradeView"}
            className="bg-#FFFF rd-10px overflow-hidden"
          >
            <TradeView />
          </GridItem>
          <GridItem bg="blue.300" area={"TradeForm"}>
            <TradeForm />
          </GridItem>
          <GridItem area={"OrderList"} className="bg-#FFFF rd-10px">
            <div className="">OrderList</div>
          </GridItem>
          <GridItem
            area={"Market"}
            overflowY={"auto"}
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
