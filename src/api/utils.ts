import CryptoJS from "crypto-js";
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

export function getSignature(param: Record<string, any>): string {
  const SECRET_KEY =
    "4mSUiEArmbdTraMjjAuQYM0g1dVL4EH44UvIhyYXaoXmZblg1ZWtlv08wW4QMk9h";

  const params = new URLSearchParams();

  Object.entries(param).forEach(([key, value]) => {
    if (value != null) params.append(key, String(value));
  });

  const query = params.toString(); // symbol=BTCUSDT&side=BUY&...
  const signature = CryptoJS.HmacSHA256(query, SECRET_KEY).toString();
  return `${query}&signature=${signature}`;
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
