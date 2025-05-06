import { createOrder } from "@/api/service/exchange";
import { OrderRequest } from "@/types";

export default function TradeForm() {
  const testTequest: OrderRequest = {
    symbol: "BTCUSDT",
    side: "BUY",
    type: "LIMIT",
    price: 94494.89,
    quantity: 0.01,
    timeInForce: "GTC",
    timestamp: Date.now(),
    recvWindow: 5000,
  };

  return (
    <div className="">
      <h1>TradeForm</h1>
      <button onClick={() => createOrder(testTequest)}>送出</button>
    </div>
  );
}
