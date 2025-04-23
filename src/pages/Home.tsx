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
import { AppDispatch, setExchangeSymbolMeta } from "@/store";

function Home() {
  const store = useDispatch<AppDispatch>();
  useEffect(() => {
    const getSymbolMetaMapIn = async () => {
      const exchangeInfo = await getSymbolMetaMap();
      if (exchangeInfo) {
        const { symbols } = exchangeInfo;
        store(setExchangeSymbolMeta({ exchangeSymbolMeta: symbols }));
      }
    };

    getSymbolMetaMapIn();
  }, [store]);

  return (
    <>
      <div className="w-full max-w-1600px mx-auto">
        <Grid
          templateAreas={`
    "header header Market"
    "Depth TradeView Market"
    "Depth footer Market"
  `}
          gridTemplateColumns="20% 1fr 20%"
          gridTemplateRows="50px 1fr 100px"
          gap="1"
          color="blackAlpha.700"
          fontWeight="bold"
          w="100%"
          h="100vh"
        >
          <GridItem area={"header"} className="bg-#FFFF rd-10px">
            <TradingPairHeader />
          </GridItem>
          <GridItem area={"Depth"} className="bg-#FFFF rd-10px">
            <Depth />
          </GridItem>
          <GridItem
            area={"TradeView"}
            className="bg-#FFFF rd-10px overflow-hidden"
          >
            <TradeView />
          </GridItem>
          <GridItem bg="blue.300" area={"footer"}>
            <TradeForm />
          </GridItem>
          <GridItem
            area={"Market"}
            overflowY={"scroll"}
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
