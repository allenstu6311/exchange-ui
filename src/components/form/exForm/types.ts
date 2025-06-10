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
