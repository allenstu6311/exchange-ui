import { getCurrentOrder } from "@/api/service/exchange";
import { useEffect } from "react";

export default function OrderList() {
  useEffect(() => {
    async function getCurrentOrderIn() {
      const res = await getCurrentOrder();
      console.log("res", res);
    }

    getCurrentOrderIn();
  }, []);

  return (
    <div className="">
      <h1>OrderList</h1>
    </div>
  );
}
