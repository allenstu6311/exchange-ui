import axios, {
  AxiosError,
  //   AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { errorToast, successToast } from "@/utils/notify";

const API_KEY =
  "UTj7iVVEx6nMyhJQiUyyIYW6GxUDXlGMcvVnzhOmlR3mktMBA5N2qk2B4EoIfSfn";
const SECRET_KEY =
  "4mSUiEArmbdTraMjjAuQYM0g1dVL4EH44UvIhyYXaoXmZblg1ZWtlv08wW4QMk9h";
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
  headers: {
    "X-MBX-APIKEY": API_KEY,
    "Content-Type": "application/x-www-form-urlencoded",
  },
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
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  private httpInterceptorsResponse() {
    this.axiosInstance.interceptors.response.use(
      async (response) => response,
      async (error) => {
        const config = error.config;
        // 失敗時自動retry
        const { retry: maxRetryCount } = config.metas || {};

        if (maxRetryCount > 0) {
          config.retryCount = config.retryCount ?? 0;

          if (config.retryCount < maxRetryCount) {
            config.retryCount++;
            // 請求延遲避免炸server
            await new Promise((res) => setTimeout(res, 1500));
            return this.axiosInstance.request(error.config);
          }
        }

        return Promise.reject(
          await handleErrorResponse(config, error.response)
        );
      }
    );
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
