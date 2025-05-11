import Decimal from "decimal.js";

type NumType = string | number;

type OperationType = "div" | "mul" | "add" | "sub";

interface ICalculateConfig {
  precision?: number;
  returnNumber?: boolean;
}

const defaultVal: string = "--";

const isNumberVaild = (num: NumType) => {
  try {
    new Decimal(num);
    return true;
  } catch (error) {
    console.error("Decimal 錯誤參數", error);
    return false;
  }
};

function formartResult<T>(
  result: Decimal,
  config: ICalculateConfig | undefined
): T {
  const { precision = result.decimalPlaces(), returnNumber } = config || {};
  const value = returnNumber ? result.toNumber() : result.toFixed(precision);
  return value as T;
}

function compute<T>({
  num1,
  num2,
  operation,
  config,
}: {
  num1: NumType;
  num2: NumType;
  operation: OperationType;
  config?: ICalculateConfig;
}): T {
  if (!isNumberVaild(num1) || !isNumberVaild(num2)) return defaultVal as T;

  try {
    const a = new Decimal(num1);
    const b = new Decimal(num2);
    const result = a[operation](b);
    return formartResult<T>(result, config);
  } catch (error) {
    console.error(
      `Decimal 計算錯誤 方法名稱:${operation} 參數 num1:${num1} num2:${num2}`
    );
    return defaultVal as T;
  }
}

function add<T extends string | number = string>(
  num1: NumType,
  num2: NumType,
  config?: ICalculateConfig
): T {
  return compute<T>({
    num1,
    num2,
    operation: "add",
    config,
  });
}

function sub<T extends string | number = string>(
  num1: NumType,
  num2: NumType,
  config?: ICalculateConfig
): T {
  return compute<T>({
    num1,
    num2,
    operation: "sub",
    config,
  });
}

function div<T extends string | number = string>(
  num1: NumType,
  num2: NumType,
  config?: ICalculateConfig
): T {
  return compute<T>({
    num1,
    num2,
    operation: "div",
    config,
  });
}

function mul<T extends string | number = string>(
  num1: NumType,
  num2: NumType,
  config?: ICalculateConfig
): T {
  return compute<T>({
    num1,
    num2,
    operation: "mul",
    config,
  });
}

export { isNumberVaild, add, sub, div, mul };
