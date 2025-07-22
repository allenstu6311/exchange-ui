import { formatNumToFixed } from "@/utils";
import {
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import {
  ExFormEnum,
  IFormRef,
} from "./types";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { OrderSide } from "@/types";
import useExFormValue from "./hook/useExFormValue";
import useExFormCalculation from "./hook/useExFormCalculation";
import useExFormValidate from "./hook/useExFormValidate";

const ExForm = forwardRef(function ExForm(
  {
    isMarket,
    assets,
    maxVolume,
    side,
  }: {
    isMarket: boolean;
    assets: number; //可用 && 可賣
    maxVolume: number;
    side: OrderSide;
  },
  ref: React.Ref<IFormRef>
) {

  const { showPrecision }: ISymbolInfoWithPrecision = useSelector(
    (state: RootState) => {
      return state.symbolInfoList.currentSymbolInfo;
    }
  );

  const { lastPrice = "0" } = useSelector((state: RootState) => {
    return state.ticker24hrData.cacheMap;
});

  const { minNotional }: ISymbolInfoWithPrecision = useSelector(
    (state: RootState) => {
      return state.symbolInfoList.currentSymbolInfo;
    }
  );

  const { base, quote } = useSelector((state: RootState) => {
    return state.symbolNameMap;
  });


  const { updateField, formData, resetField } = useExFormValue();

  const { calculateEffect } = useExFormCalculation({
    formData,
    isMarket,
    updateField,
    assets,
  });

  const { validationMap, validateInput, getErrorMsg, validateAll } = useExFormValidate(formData, maxVolume);
  const { price: priceValidate, quantity: quantityValidate } = validationMap;


  // ✅ 暴露方法給父元件使用
  useImperativeHandle(ref, () => ({
    reset() {
      resetField();
    },
    validate() {
      return validateAll();
    },
    getFormData() {
      return {
        ...formData,
      };
    },
  }));

  // 初始化價錢
  useEffect(() => {
    const initPrice = isMarket ? "" : formatNumToFixed(lastPrice, showPrecision);
    updateField(ExFormEnum.PRICE, initPrice);
  }, [lastPrice, isMarket, showPrecision, updateField])

  const handleFormChange = (key: ExFormEnum, value: string) => {
    // 更新formData
    updateField(key, value);

    // 副作用計算
    calculateEffect(key, value);

    // 驗證
    validateInput(key, value);
  }

  return (
    <div className="w-full">
      <form action="" className="flex flex-col gap-8px">
      {/* 價錢 */}
        <FormControl isInvalid={priceValidate.invalid}>
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
          <FormErrorMessage>{getErrorMsg(ExFormEnum.PRICE, priceValidate)}</FormErrorMessage>
        </FormControl>
        {/* 數量 */}
        <FormControl isInvalid={quantityValidate.invalid}>
          <InputGroup>
            <Input
              isInvalid={quantityValidate.invalid}
              errorBorderColor="red.500"
              type="number"
              placeholder="數量"
              value={formData.quantity}
              onChange={(e) => handleFormChange(ExFormEnum.QUANITY, e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <p>{base}</p>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{getErrorMsg(ExFormEnum.QUANITY, quantityValidate, {
            maxVolume,
            minNotional,
            quote,
            side,
            assets,
          })}
          </FormErrorMessage>
        </FormControl>
        {/* 滑桿 */}
        <FormControl className="px-8px">
          <Slider
            aria-label="slider-ex-1"
            defaultValue={0}
            max={100}
            value={formData.slider}
            onChange={(val) => handleFormChange(ExFormEnum.SLIDER, val.toString())}
            focusThumbOnChange={false}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb className="peer" />
            <SliderMark
              value={formData.slider}
              textAlign="center"
              bg="blue.500"
              color="white"
              mt='-10'
              ml='-5'
              w="12"
              className="hidden peer-hover:block peer-active:block!"
            >
              {formData.slider}%
            </SliderMark>
          </Slider>
        </FormControl>
        {/* 成交額 */}
        <FormControl>
          <InputGroup>
            <Input
              type="number"
              placeholder="成交額"
              value={formData.amount}
              onChange={(e) => handleFormChange(ExFormEnum.AMOUNT, e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <p>{quote}</p>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </form>
    </div>
  );
});
export default ExForm;
