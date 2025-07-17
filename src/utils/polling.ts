interface IPollingConfig {
    retry?: number;
    maxRetryDelay?: number; // 最大重試延遲時間
}

export interface IPollingController {
    stop: () => void;
    start: () => void;
    config?: (config: IPollingConfig) => void;
}


export function polling(fn: () => any, time: number, config?: IPollingConfig): IPollingController {
    const { retry = 0, maxRetryDelay = 30 * 1000 } = config || {};
    let isPolling = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let retryCount = retry;
    let waitTime = time;

    const closePolling = () => {
        isPolling = false;
        if (timer) clearTimeout(timer);
        timer = null;
    }

    const poll = async () => {
        try {
            if (!isPolling) return //如果已經結束就不再執行
            await fn();
            if (!isPolling) return; // ✅ 執行 fn 後也再次確認
            timer = setTimeout(poll, waitTime);
        } catch (error) {
            console.error(`[polling poll] ${error}`);
            if (!isPolling) return;
            if (retryCount > 0) {               
                retryCount--;
                // 指數閉退
                waitTime = Math.min(waitTime * 2, maxRetryDelay);
                timer = setTimeout(poll, waitTime);
            }else{
                closePolling()
            }
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
            closePolling()
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