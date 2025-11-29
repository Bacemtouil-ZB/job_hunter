declare module "currency.js" {
  export interface CurrencyOptions {
    symbol?: string;
    precision?: number;
    separator?: string;
    decimal?: string;
  }

  export default function currency(
    value: number | string,
    options?: CurrencyOptions
  ): {
    format: () => string;
    value: number;
  };
}
