import crypto from "crypto";
import "dotenv/config";
import { ClientRequest, IncomingMessage, ServerResponse } from "http";

type ProxyReqWithBodyQuery = IncomingMessage & {
  body?: any;
  query?: any;
};

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


export async function binanceProxyHandler(proxyReq:ClientRequest, req: ProxyReqWithBodyQuery, res: ServerResponse<IncomingMessage>) {
  const { method, body, query } = req;
  proxyReq.setHeader("X-MBX-APIKEY", process.env.API_KEY || "");
 
  if (method !== 'GET') {
    const signature = getSignature(body);
    proxyReq.setHeader("Content-Length", Buffer.byteLength(signature));
    proxyReq.write(signature);
    proxyReq.end();
  }else{
    const signature = getSignature(query);
    const pathWithoutQuery = proxyReq.path.split('?')[0];
    proxyReq.path = pathWithoutQuery + '?' + signature;
  }
}