export const getElementScrollbarWidth = (element: HTMLDivElement | null): number => {
    if (!element) return 0;
    // 計算 scrollbar 寬度
    return element.offsetWidth - element.clientWidth;
};  