import { IAPIResponse } from ".";
import { getServerTime } from "./service/exchange/exchange";

enum ErrorCode {
  /**
   * 時間戳與服務器相差過大
   */
  TIME_STAMP = -1021,
  /**
   * 低於最小購買數量
   */
  MINQTY = -1013,
}

export function getSafeTimestamp(timeOffset: number): number {
  return Date.now() - timeOffset; // ✅ 套用偏移
}

export async function withRetry<T>(
  request: () => Promise<IAPIResponse<T>>,
  shouldRetry: (error: any) => boolean = () => true,
  delay: number = 3000 // 可以變成config，可再多做限制retry次數功能
) {
  try {
    const res = await request();
    return res;
  } catch (error: any) {
    const { data } = error;
    const res: IAPIResponse<T> = error?.data || {};

    if (shouldRetry(data)) {
      if (data.data.code === ErrorCode.TIME_STAMP) {
        await new Promise((res) => setTimeout(res, delay));
        await getServerTime();
      }
      return request();
    }
    return res;
  }
}
