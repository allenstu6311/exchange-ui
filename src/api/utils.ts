import { AxiosResponse } from "axios";
import CryptoJS from "crypto-js";
import { IAPIResponse } from ".";
import { getServerTime } from "./service/exchange/exchange";
import { delay } from "framer-motion";

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

export async function handleTimestampDriftRetry<T>(
  response: AxiosResponse,
  request: () => Promise<IAPIResponse<T>>,
  delay: number = 3000
) {
  const { data } = response;
  if (data.code === -1021) {
    setTimeout(() => {
      getServerTime().then(() => {
        return request(); // 重新發送請求
      });
    }, delay);
  }
}
