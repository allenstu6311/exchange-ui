export type InputKey = "amount" | "quantity" | "price" | "slider";

export interface IExForm {
  price: string;
  quantity: string;
}

export interface IPriceValidate {
  invalid: boolean;
  empty: boolean;
  precision: boolean;
}

export interface IQuanityValidate {
  invalid: boolean;
  empty: boolean;
  max: boolean;
}

export interface IExFormValidate {
  price: IPriceValidate;
  quantity: IQuanityValidate;
  invalid: boolean;
}

export interface IFormRef {
  reset: () => void;
  validate: () => boolean;
  getFormData: () => IExForm;
}

export interface IPrecisionMap {
  showPrecision: number;
  tradePrecision: number;
  quoteAssetPrecision: number;
}

export type ValidateInputType = IQuanityValidate | IPriceValidate

export enum ExFormEnum {
  PRICE = "price",
  QUANITY = "quantity",
  AMOUNT = "amount",
  SLIDER = "slider"
}
