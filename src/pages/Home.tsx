import $http from "@/api";
import { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, GridItem } from "@chakra-ui/react";
import TradingPairHeader from "@/components/TradingPairHeader";
import Depth from "@/components/Depth";
import TradeView from "@/components/TradeView";
import TradeForm from "@/components/TradeForm";
import "@/App.css";
import Market from "@/components/Market";

function Home() {
  const counter = useSelector((state: RootState) => {
    // console.log('state', state);
  });
  const store = useDispatch<AppDispatch>();
  // console.log('store',store);

  return (
    <>
      <div className="w-full max-w-1524px mx-auto">
        <Grid
          templateAreas={`
    "header header header"
    "Depth TradeView Market"
    "Depth footer Market"
  `}
          gridTemplateColumns="21% 1fr 21%"
          gridTemplateRows="150px 1fr 100px"
          gap="1"
          color="blackAlpha.700"
          fontWeight="bold"
          w="100%"
          h="100vh"
        >
          <GridItem bg="orange.300" area={"header"}>
            <TradingPairHeader />
          </GridItem>
          <GridItem area={"Depth"}>
            <Depth />
          </GridItem>
          <GridItem area={"TradeView"}>
            <TradeView />
          </GridItem>
          <GridItem bg="blue.300" area={"footer"}>
            <TradeForm />
          </GridItem>
          <GridItem area={"Market"} overflowY={"scroll"}>
            <Market />
          </GridItem>
        </Grid>
      </div>
    </>
  );
}

export default Home;
