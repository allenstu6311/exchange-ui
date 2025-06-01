import axios, {
  //   AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { errorToast, successToast } from "@/utils/notify";
import { log } from "node:console";

const API_KEY =
  "UTj7iVVEx6nMyhJQiUyyIYW6GxUDXlGMcvVnzhOmlR3mktMBA5N2qk2B4EoIfSfn";
const SECRET_KEY =
  "4mSUiEArmbdTraMjjAuQYM0g1dVL4EH44UvIhyYXaoXmZblg1ZWtlv08wW4QMk9h";

interface IMetas {
  onSuccess?: (data: any) => void;
  onError?: (config: CustomRequestConfig, response: any) => void;
  retry?: number;
  middleware?: Middleware<any>[];
}

interface CustomRequestConfig extends AxiosRequestConfig {
  metas?: IMetas;
}

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
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

export type Middleware<T> = (
  config: CustomRequestConfig,
  response: any
) => Promise<T>;

interface IAPIResponse<T = any> {
  success: boolean;
  data: T;
  error?: CustomRequestConfig;
}

async function handleSuccessResponse<T = any>(
  response: AxiosResponse
): Promise<IAPIResponse<T>> {
  const { status, data, config } = response;
  
  const { onSuccess } =
    (config as CustomInternalAxiosRequestConfig).metas || {};
  if (status === 200) {
    if (onSuccess) {
      onSuccess(data);
    }
    return { success: true, data };
  }
  return { success: true, data: {} as T, error: config };
}

async function handleErrorResponse<T = any>(
  config: CustomRequestConfig,
  response: any = {}
): Promise<IAPIResponse<T>> {
  const { onError } = config?.metas || {};

  if (onError) {
    onError(config, response);
  } else {
    const { data } = response || {};
    errorToast("錯誤", data.msg);
  }
  return { success: false, data: {} as T, error: config };
}

class HttpInstance {
  /**請求實體 */
  public axiosInstance: AxiosInstance;

  private middlewares: Middleware<any>[] = [];

  private addMiddleware(middleware: Middleware<any>[]) {
    this.middlewares = [...this.middlewares, ...middleware];
  }

  constructor(config?: AxiosRequestConfig) {
    const finalConfig = config || defaultConfig;
    this.axiosInstance = axios.create(finalConfig); // ✅ 先創建 axios instance
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  private async runMiddlewares(config: any, response: AxiosResponse) {
    let result = response;
    for (const middleware of this.middlewares) {
      result = await middleware(config, result);
    }
    this.middlewares = []; // 清空中間件
    return result;
  }

  private httpInterceptorsRequest() {
    this.axiosInstance.interceptors.request.use(
      (config: CustomInternalAxiosRequestConfig) => {
        const middleware = config?.metas?.middleware;
        if (middleware) {
          this.addMiddleware(middleware);
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
        return this.runMiddlewares(response.config, response);
      },
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

        return Promise.reject(await handleErrorResponse(config, error.response));        
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
      metas?: IMetas;
    }): Promise<IAPIResponse<T>> => {
      return instance
        .get<T>(args.url, {
          params: args.params,
          metas: args.metas,
        } as CustomRequestConfig)
        .then((res) => handleSuccessResponse<T>(res));
    },

    post: async <T = any>(args: {
      url: string;
      body?: Record<string, any>;
      metas?: IMetas;
    }): Promise<IAPIResponse<T>> => {
      return instance
        .post<T>(args.url, args.body, {
          metas: args.metas,
        } as CustomRequestConfig)
        .then((res) => handleSuccessResponse<T>(res));
    },
    delete: async <T = any>(args: {
      url: string;
      body?: Record<string, any>;
      metas?: IMetas;
    }): Promise<IAPIResponse<T>> => {
      return instance
        .delete<T>(args.url, {
          data: args.body,
          metas: args.metas,
        } as CustomRequestConfig)
        .then((res) => handleSuccessResponse<T>(res));
    },
  };
}
const http = createHttpClient(instance);
const proxyHttp = createHttpClient(postInstance);

export { http, proxyHttp };
