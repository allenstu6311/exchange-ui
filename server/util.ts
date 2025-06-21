import crypto from "crypto";
import "dotenv/config";

export function getSignature(param: Record<string, any>): string {
  if (!param) return "";
  const params = new URLSearchParams();

  Object.entries(param).forEach(([key, value]) => {
    if (value != null) params.append(key, String(value));
  });

  const query = new URLSearchParams(params).toString();
  const signature = crypto
    .createHmac("sha256", process.env.SECRET_KEY || "")
    .update(query)
    .digest("hex");
  return `${query}&signature=${signature}`;
}
