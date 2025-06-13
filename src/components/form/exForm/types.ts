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
  min: boolean;
}

export interface IFormValidate {
  price: IPriceValidate;
  quantity: IQuanityValidate;
  invalid: boolean;
}

export interface IFormRef {
  reset: () => void;
  validate: () => boolean;
  getFormData: () => IExForm;
}
