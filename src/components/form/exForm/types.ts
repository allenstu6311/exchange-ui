export interface IExForm {
  price: string;
  quantity: string;
  amount: string;
  slider: number;
}

export interface IPriceValidate {
  invalid: boolean;
  empty: boolean;
}

export interface IQuanityValidate {
  invalid: boolean;
  empty: boolean;
  max: boolean;
  min: boolean;
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

export type ValidateInputType = IQuanityValidate | IPriceValidate;

export enum ExFormEnum {
  PRICE = "price",
  QUANITY = "quantity",
  AMOUNT = "amount",
  SLIDER = "slider",
}

export type UpdateFieldType = (key: ExFormEnum, value: string) => void;