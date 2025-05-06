import CryptoJS from "crypto-js";

export function getSignature(param: Record<string, any>) {
  const SECRET_KEY =
    "4mSUiEArmbdTraMjjAuQYM0g1dVL4EH44UvIhyYXaoXmZblg1ZWtlv08wW4QMk9h";

  const params = new URLSearchParams();

  Object.entries(param).forEach(([key, value]) => {
    if (value != null) params.append(key, String(value));
  });

  const query = params.toString(); // symbol=BTCUSDT&side=BUY&...
  const signature = CryptoJS.HmacSHA256(query, SECRET_KEY).toString();

  return { query, signature }; // ✅ 產生簽名
}
