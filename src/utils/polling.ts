interface IPollingConfig {
    retry?: number;
}

export interface IPollingController {
    stop: () => void;
    start: () => void;
    config?: (config: IPollingConfig) => void;
}

/**
 * 1.錯誤處理
 * 2.指數閉退
 * 3.retry
 */

export function polling(fn: () => any, time: number): IPollingController {
    let isPolling = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    
    const poll = async () => {
        try {
            if (!isPolling) return //如果已經結束就不再執行
            await fn();
            if (!isPolling) return; // ✅ 執行 fn 後也再次確認
            timer = setTimeout(poll, time);
        } catch (error) {
            console.error(`[polling] ${error}`);
            if (!isPolling) return;
            // 之後建立重試機制
            // timer = setTimeout(poll, time);
        }

    }

    return {
        start() {
            // 未來可能會使用同個polling實體，避免生成重複的poll
            if (!isPolling) {
                isPolling = true;
                poll();
            }
        },
        stop() {
            isPolling = false;
            if (timer) clearTimeout(timer);
            timer = null;
        },
    }
}

/**
 * 通用延遲函數
 * @param delayMs 延遲時間（毫秒）
 * @returns Promise
 */
export function delay(delayMs: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delayMs));
}