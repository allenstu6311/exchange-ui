import { RefObject } from "react";
import { JSX } from "@emotion/react/jsx-runtime";

export interface UseVirtualScrollProps {
    // enabled: boolean;
    rowHeight: number;
    ref: RefObject<HTMLElement | null>;
    count: number;
}

export interface TableColumns {
  label: string;
  key: string;
  format?: (val: any, item?: any) => string;
  getStyle?: (val: any, item: any) => { [style: string]: string };
  className?: string | ((val: any, item: any) => string);
  render?: (content: any, item: any, index: number) => JSX.Element;
}

  