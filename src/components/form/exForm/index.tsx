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
  ExFormEnum,
  IExForm,
  IFormRef,
  IExFormValidate,
  InputKey,
  IPrecisionMap,
  IQuanityValidate,
} from "./types";
import {
  getErrorMsg,
  validateForm,
  validatePriceInput,
  validateQuantityInput,
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
    maxVolume,
  }: {
    isMarket: boolean;
    assets: number; //可用 && 可賣
    maxVolume: number;
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

  const [validationMap, setValidationMap] = useState<IExFormValidate>({
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
      const pricePass = validatePriceInput({
        formData,
        precision: showPrecision,
        setValidationMap,
      });
      const quantityPass = validateQuantityInput({
        formData,
        precision: tradePrecision,
        maxVolume,
        setValidationMap,
      });
      return pricePass && quantityPass;
    },
    getFormData() {
      return {
        ...formData,
      };
    },
  }));

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
      case ExFormEnum.PRICE:
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
      case ExFormEnum.QUANITY:
        if (!validatePrecision(tradePrecision, value)) return;
        handleQuantityInput({
          currPrice,
          value,
          formData: nextFormData,
          precisionMap,
          setAmount,
        });
        break;
      case ExFormEnum.AMOUNT:
        if (!validatePrecision(quoteAssetPrecision, value)) return;
        handleAmountInput({
          currPrice,
          value,
          formData: nextFormData,
          precisionMap,
          setAmount,
        });
        break;

      case ExFormEnum.SLIDER:
        if (assets) {
          setIsDragging(true);
          handleSilderInput({
            currPrice,
            value,
            assets,
            formData: nextFormData,
            precisionMap,
            setAmount,
          });
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
            onChange={(e) => handleFormChange(ExFormEnum.PRICE, e.target.value)}
            disabled={isMarket}
          />
          <InputRightElement width="4.5rem">
            <p>{quote}</p>
          </InputRightElement>
        </InputGroup>
        <div className="text-red text-14px">
          {getErrorMsg(ExFormEnum.PRICE, priceValidate)}
        </div>
        <InputGroup>
          <Input
            isInvalid={quantityValidate.invalid}
            errorBorderColor="red.500"
            type="number"
            placeholder="數量"
            value={formData.quantity}
            onChange={(e) => {
              const rawValue = e.target.value;
              const sanitized = rawValue ? String(Number(rawValue)) : ""; // 0111 → 111
              handleFormChange(ExFormEnum.QUANITY, sanitized);
            }}
          />
          <InputRightElement width="4.5rem">
            <p>{base}</p>
          </InputRightElement>
        </InputGroup>
        <div className="text-red text-14px">
          {getErrorMsg(ExFormEnum.QUANITY, quantityValidate)}
        </div>

        <InputGroup className="px-8px">
          <Slider
            aria-label="slider-ex-1"
            defaultValue={0}
            max={100}
            value={sliderValue}
            onChange={(val) => {
              setSliderValue(val);
              handleFormChange(ExFormEnum.SLIDER, val.toString());
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
              handleFormChange(ExFormEnum.AMOUNT, e.target.value);
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
