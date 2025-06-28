import { RefObject } from "react";

export interface UseVirtualScrollProps {
    // enabled: boolean;
    rowHeight: number;
    ref: RefObject<HTMLElement | null>;
    count: number;
  }
  