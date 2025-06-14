import { OrderRequest, SymbolNameMapType } from "@/types";
import { add, div, formatNumToFixed, mul } from "@/utils";
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
import {
  IExForm,
  IFormRef,
  IFormValidate,
  InputKey,
  IPrecisionMap,
} from "./types";
import {
  validateEmpty,
  validateForm,
  validatePricePrecision,
} from "./validate";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  getCurrentPrice,
  handleAmountInput,
  handlePriceInput,
  handleQuantityInput,
  handleSilderInput,
} from "./utils";
import { validatePrecision } from "@/utils/general";

const ExForm = forwardRef(function ExForm(
  {
    isMarket,
    assets,
  }: {
    isMarket: boolean;
    assets: number; //可用 && 可賣
  },
  ref: React.Ref<IFormRef>
) {
  const [amount, setAmount] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [formData, setFormData] = useState<IExForm>({
    price: "",
    quantity: "",
  });

  const [validationMap, setValidationMap] = useState<IFormValidate>({
    ...validateForm,
  });

  const currSymbolInfo: ISymbolInfoWithPrecision = useSelector(
    (state: RootState) => {
      return state.symbolInfoList.currentSymbolInfo;
    }
  );

  const symbolMap = useSelector((state: RootState) => {
    return state.symbolNameMap;
  });

  const cacheTickerData = useSelector((state: RootState) => {
    return state.ticker24hrData.cacheMap;
  });
  const { lastPrice = "0" } = cacheTickerData;

  const { base, quote } = symbolMap;
  const { showPrecision, quotePrecision, tradePrecision, quoteAssetPrecision } =
    currSymbolInfo;
  const { price: priceValidate, quantity: quantityValidate } = validationMap;

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
      setValidationMap({
        ...validateForm,
      });
    },
    validate() {
      const pricePass = validatePrice();
      const quantityPass = validateQuantity();
      return pricePass && quantityPass;
    },
    getFormData() {
      return {
        ...formData,
      };
    },
  }));

  const validatePrice = () => {
    const emptyPass = validateEmpty(formData.price);
    const precisionPass = validatePricePrecision(formData.price, showPrecision);
    const isVaild = emptyPass && precisionPass;
    setValidationMap((prev) => ({
      ...prev,
      price: {
        invalid: !isVaild,
        empty: emptyPass,
        precision: precisionPass,
      },
    }));
    return isVaild;
  };

  const validateQuantity = () => {
    const emptyPass = validateEmpty(formData.quantity);
    // const precisionPass = validatePricePrecision(formData.quantity, showPrecision);
    const isVaild = emptyPass;
    // setValidationMap((prev) => ({
    //   ...prev,
    //   quantity: {
    //     invalid: !isVaild,
    //     empty: emptyPass,
    //     min: true,
    //   },
    // }));
    return isVaild;
  };

  useEffect(() => {
    if (assets && !isDragging) {
      const percent = div(amount || 0, assets, { precision: 3 });
      setSliderValue(Number(mul(percent, 100, { precision: 2 })));
    }
  }, [amount]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      price: isMarket ? "" : formatNumToFixed(lastPrice, showPrecision),
    }));
  }, [lastPrice, isMarket, showPrecision]);

  const handleFormChange = (key: InputKey, value: string) => {
    setIsDragging(false);
    const nextFormData: IExForm = { ...formData, [key]: value };
    const currPrice = getCurrentPrice(nextFormData, lastPrice, isMarket);
    const precisionMap: IPrecisionMap = {
      showPrecision,
      tradePrecision,
      quoteAssetPrecision,
    };

    switch (key) {
      case "price":
        if (!validatePrecision(showPrecision, value)) return;
        handlePriceInput({
          currPrice,
          value,
          amount,
          formData: nextFormData,
          precisionMap,
          setAmount,
        });
        break;
      case "quantity":
        if (!validatePrecision(tradePrecision, value)) return;
        handleQuantityInput({
          currPrice,
          value,
          formData: nextFormData,
          precisionMap,
          setAmount,
        });
        break;
      case "amount":
        if (!validatePrecision(quoteAssetPrecision, value)) return;
        handleAmountInput({
          currPrice,
          value,
          formData: nextFormData,
          precisionMap,
          setAmount,
        });
        break;

      case "slider":
        if (assets) {
          setIsDragging(true);
          handleSilderInput({
            currPrice,
            value,
            assets,
            formData: nextFormData,
            precisionMap,
            setAmount
          })
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
            isInvalid={priceValidate.invalid}
            errorBorderColor="red.500"
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
            isInvalid={quantityValidate.invalid}
            errorBorderColor="red.500"
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
              handleFormChange("slider", val.toString());
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
