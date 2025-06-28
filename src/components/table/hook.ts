import { useVirtualizer } from "@tanstack/react-virtual";
import { UseVirtualScrollProps } from "./types";

export function useVirtualScroll({ rowHeight, ref, count }: UseVirtualScrollProps) {
    const virtualizer = useVirtualizer({
        count,
        getScrollElement: () => ref.current,
        estimateSize: () => rowHeight || 30,
    });

    return {
        virtualItems: virtualizer.getVirtualItems(),
        totalHeight: virtualizer.getTotalSize(),
    }
}