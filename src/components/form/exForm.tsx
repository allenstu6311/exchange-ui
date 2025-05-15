import { OrderRequest, SymbolNameMapType } from "@/types";
import { add, div, mul } from "@/utils";
import {
  Input,
  InputGroup,
  InputRightElement,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

type InputKey = "amount" | "quantity" | "price" | "slider";

const ExForm = forwardRef(function ExForm(
  {
    symbolMap,
    setFormData,
    formData,
    isMarket,
    maxValue,
    lastPrice,
  }: {
    symbolMap: SymbolNameMapType;
    setFormData: React.Dispatch<React.SetStateAction<OrderRequest>>;
    formData: OrderRequest;
    isMarket: boolean;
    maxValue: number;
    lastPrice: string;
  },
  ref: React.Ref<{ reset: () => void }> // 👈 暴露一個 reset 方法
) {
  const [amount, setAmount] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const { base, quote } = symbolMap;

  // ✅ 暴露方法給父元件使用
  useImperativeHandle(ref, () => ({
    reset() {
      setAmount("");
      setSliderValue(0);
      setFormData((prev) => ({
        ...prev,
        price: "",
        quantity: "",
      }));
    },
  }));

  useEffect(() => {
    if (amount && maxValue && !isDragging) {
      const percent = div(amount, maxValue, { precision: 3 });
      setSliderValue(Number(mul(percent, 100, { precision: 2 })));
    }
  }, [amount]);

  const handleFormChange = (key: InputKey, value: string) => {
    setIsDragging(false);
    const nextFormData: OrderRequest = { ...formData, [key]: value };

    const limitPrice = nextFormData.price || "";
    const currPrice = isMarket ? lastPrice : limitPrice;

    switch (key) {
      case "price":
        if (currPrice && nextFormData.quantity) {
          const newAmount = mul(currPrice, nextFormData.quantity);
          setAmount(newAmount);
        } else if (amount) {
          nextFormData.quantity = div(amount, value);
        }

        break;
      case "quantity":
        if (currPrice) {
          const newAmount = mul(currPrice, value);
          setAmount(newAmount);
        }
        break;
      case "amount":
        if (currPrice || isMarket) {
          nextFormData.quantity = div(value, currPrice);
        }
        break;

      case "slider":
        if (maxValue) {
          setIsDragging(true);
          const newAmount = div(mul(maxValue, value), 100);
          setAmount(newAmount);

          if (currPrice) {
            nextFormData.quantity = div(newAmount, currPrice);
          }
        }

        break;
      default:
        break;
    }
    setFormData(nextFormData);
  };

  return (
    <div className="w-full">
      <form action="" className="flex flex-col gap-8px">
        <InputGroup>
          <Input
            type="number"
            placeholder="價格"
            value={formData.price}
            onChange={(e) => handleFormChange("price", e.target.value)}
            disabled={isMarket}
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
            onChange={(e) => handleFormChange("quantity", e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <p>{base}</p>
          </InputRightElement>
        </InputGroup>

        <InputGroup className="my-8px px-8px">
          <Slider
            aria-label="slider-ex-1"
            defaultValue={0}
            max={100}
            value={sliderValue}
            onChange={(val) => {
              setSliderValue(val);
              handleFormChange("slider", val as any);
            }}
            focusThumbOnChange={false}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb className="peer" />
            <SliderMark
              value={sliderValue}
              textAlign="center"
              bg="blue.500"
              color="white"
              mt="-10"
              ml="-5"
              w="12"
              className="hidden peer-hover:block peer-active:block!"
            >
              {sliderValue}%
            </SliderMark>
          </Slider>
        </InputGroup>

        <InputGroup>
          <Input
            type="number"
            placeholder="成交額"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              handleFormChange("amount", e.target.value);
            }}
          />
          <InputRightElement width="4.5rem">
            <p>{quote}</p>
          </InputRightElement>
        </InputGroup>
      </form>
    </div>
  );
});
export default ExForm;
