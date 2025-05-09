import { OrderRequest } from "@/types";
import { isNumber } from "@/utils";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function ExForm({
  base,
  quote,
  setFormData,
  formData,
}: {
  base: string;
  quote: string;
  setFormData: React.Dispatch<React.SetStateAction<OrderRequest>>;
  formData: OrderRequest;
}) {
  const [amount, setAmount] = useState<number | string>("");

  useEffect(() => {
    const { price, quantity } = formData;
    if (price && quantity) {
      const amount = Number(price) * Number(quantity);
      setAmount(amount);
    } else {
      setAmount("");
    }
  }, [formData]);

  const handleChange = (key: keyof OrderRequest, value: string) => {
    setFormData((prev: OrderRequest) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  return (
    <div className="w-full">
      <form action="" className="flex flex-col gap-8px">
        <InputGroup>
          <Input
            type="number"
            placeholder="價格"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <p>{quote}</p>
          </InputRightElement>
        </InputGroup>
        <InputGroup>
          <Input
            type="number"
            placeholder="數量"
            value={formData.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <p>{base}</p>
          </InputRightElement>
        </InputGroup>
        <InputGroup>
          <Input
            type="number"
            placeholder="成交額"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <InputRightElement width="4.5rem">
            <p>{quote}</p>
          </InputRightElement>
        </InputGroup>
      </form>
    </div>
  );
}
export default ExForm;
