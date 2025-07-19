import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { errorToast, successToast } from "@/utils/notify";
import store, { AppDispatch, setIsLoading } from "@/store";
import { ErrorCode } from "./enum";
import { getServerTime } from "./service/exchange/exchange";

export interface ICustomRequestConfig extends AxiosRequestConfig {
  metas?: IMetas;
}

interface ICustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  metas?: IMetas;
}

const defaultConfig: AxiosRequestConfig = {
  baseURL: "https://testnet.binance.vision/api/v3",
  timeout: 10000,
};

const proxyConfig: AxiosRequestConfig = {
  baseURL: "/proxy",
  timeout: 10000,
  // headers: {
  //   "Content-Type": "application/x-www-form-urlencoded",
  // },
};

type MiddlewareResult<T = any> = T | Promise<T>;

export type Middleware<T = any> = (
  config: ICustomRequestConfig,
  response: T
) => MiddlewareResult;

export interface IAPIResponse<T = any> {
  success: boolean;
  data: T;
  error?: ICustomRequestConfig;
}

interface IMetas<T = any> {
  onSuccess?: (data: T) => void;
  onError?: (config: ICustomRequestConfig, response: AxiosResponse) => void;
  retry?: number;
  middleware?: Middleware<T>[];
}

async function runMiddlewares<T = any>(
  config: ICustomRequestConfig,
  response: AxiosResponse<T>,
  middlewares: Middleware<T>[] = []
): Promise<MiddlewareResult<T>> {
  let result: MiddlewareResult = response;
  for (const middleware of middlewares) {
    try {
      result = await middleware(config, result);
    } catch (error) {
      console.error("[runMiddlewares] error:", error);
      return result;
    }
  }
  return result;
}

async function handleSuccessResponse<T = any>(
  response: AxiosResponse
): Promise<IAPIResponse<T>> {
  const { status, data, config } = response;

  const { onSuccess, middleware } =
    (config as ICustomInternalAxiosRequestConfig).metas || {};
  if (status === 200) {
    if (onSuccess) {
      onSuccess(data);
    }
    const resultData = await runMiddlewares(config, response, middleware || []);
    return { success: true, data: resultData.data };
  }
  return { success: true, data: {} as T, error: config };
}

async function handleErrorResponse<T = any>(
  config: ICustomRequestConfig,
  response: any = {}
): Promise<IAPIResponse<T>> {
  const { onError } = config?.metas || {};

  if (onError) {
    onError(config, response);
  } else {
    const { data } = response || {};
    errorToast("錯誤", data.msg);
  }
  return { success: false, data: response as T, error: config };
}

let requestCount = 0;
const whiteList = ['openOrders', 'myTrades'] // 不觸發loading樣式

// 使用 Map 存儲 retryCount，key 為請求的唯一標識
const retryCountMap = new Map<string, number>();

class HttpInstance {
  /**請求實體 */
  public axiosInstance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    const finalConfig = config || defaultConfig;
    this.axiosInstance = axios.create(finalConfig); // ✅ 先創建 axios instance
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  private httpInterceptorsRequest() {

    this.axiosInstance.interceptors.request.use(
      (config: ICustomInternalAxiosRequestConfig) => {
        requestCount++;
        if (!whiteList.includes(config.url || '')) {
          store.dispatch(setIsLoading(true))
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  private httpInterceptorsResponse() {
    this.axiosInstance.interceptors.response.use(
      async (response) => {
        requestCount--;

        if (requestCount === 0) {
          store.dispatch(setIsLoading(false))
        }
        return response;
      },
      async (error) => {
        requestCount--;
        if (requestCount === 0) {
          store.dispatch(setIsLoading(false))
        }

        const config = error.config;
        const { retry: maxRetryCount } = config.metas || {};

        // 如果沒有設定重試，直接返回錯誤
        if (!maxRetryCount || maxRetryCount <= 0) {
          return Promise.reject(
            await handleErrorResponse(config, error.response)
          );
        }

        // 檢查重試次數
        const requestKey = config.url;
        const currentRetryCount = retryCountMap.get(requestKey) || 0;

        if (currentRetryCount >= maxRetryCount) {
          // 重試次數用完，清理 Map 並返回錯誤
          retryCountMap.delete(requestKey);
          return Promise.reject(
            await handleErrorResponse(config, error.response)
          );
        }

        // 處理重試邏輯
        await this.handleRetry(error, requestKey, currentRetryCount);
        return this.axiosInstance.request(error.config);
      }
    );
  }

  private async handleRetry(error: any, requestKey: string, currentRetryCount: number) {
    // 統一延遲，避免炸server
    await new Promise((res) => setTimeout(res, 1500));
    const { code } = error.response?.data || {};

    switch (code) {
      case ErrorCode.TIME_STAMP:
        // 處理時間戳錯誤：同步服務器時間
        await getServerTime();
        break;
    }

    // 更新重試次數
    retryCountMap.set(requestKey, currentRetryCount + 1);
  }
}

const instance = new HttpInstance().axiosInstance;
const postInstance = new HttpInstance(proxyConfig).axiosInstance;

function createHttpClient(instance: AxiosInstance) {
  return {
    get: async <T = any>(args: {
      url: string;
      params?: Record<string, any>;
      metas?: IMetas<T>;
    }): Promise<IAPIResponse<T>> => {
      return instance
        .get<T>(args.url, {
          params: args.params,
          metas: args.metas,
        } as ICustomRequestConfig)
        .then((res) => handleSuccessResponse<T>(res));
    },
    post: async <T = any>(args: {
      url: string;
      body?: Record<string, any>;
      metas?: IMetas<T>;
    }): Promise<IAPIResponse<T>> => {
      return instance
        .post<T>(args.url, args.body, {
          metas: args.metas,
        } as ICustomRequestConfig)
        .then((res) => handleSuccessResponse<T>(res));
    },
    delete: async <T = any>(args: {
      url: string;
      body?: Record<string, any>;
      metas?: IMetas<T>;
    }): Promise<IAPIResponse<T>> => {
      return instance
        .delete<T>(args.url, {
          data: args.body,
          metas: args.metas,
        } as ICustomRequestConfig)
        .then((res) => handleSuccessResponse<T>(res));
    },
  };
}
const http = createHttpClient(instance);
const proxyHttp = createHttpClient(postInstance);

export { http, proxyHttp };
