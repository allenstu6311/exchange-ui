import axios, {
  //   AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
// import CryptoJS from "crypto-js";

const API_KEY =
  "UTj7iVVEx6nMyhJQiUyyIYW6GxUDXlGMcvVnzhOmlR3mktMBA5N2qk2B4EoIfSfn";
const SECRET_KEY =
  "4mSUiEArmbdTraMjjAuQYM0g1dVL4EH44UvIhyYXaoXmZblg1ZWtlv08wW4QMk9h";

interface CustomRequestConfig extends AxiosRequestConfig {
  meta?: Record<string, any>;
}

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  meta?: Record<string, any>;
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

// type MiddlewareContext = {
//   config: AxiosRequestConfig;
//   response?: any;
//   error?: any;
//   result?: { success: boolean; data?: any; error?: any };
//   meta?: {
//     onSuccess?: (data: any) => void;
//     onError?: (err: any) => void;
//     [key: string]: any;
//   };
// };

export type Middleware<T> = (
  config: CustomRequestConfig,
  response: any
) => Promise<T>;

async function handleSuccessResponse(
  config: CustomRequestConfig,
  response?: AxiosResponse
) {
  const { onSuccess } = config?.meta || {};
  if (response) {
    const { status, data } = response;
    if (status === 200) {
      if (onSuccess) {
        onSuccess(data);
      } else {
        // 預設成功的動作
        // alert(response.data.msg);
      }
      return { success: true, data };
    }
  }
}

async function handleErrorResponse(
  config: CustomRequestConfig,
  response: any = {}
) {
  const { onError } = config?.meta || {};

  if (onError) {
    onError(config, response);
  } else {
    const { data } = response || {};

    alert(data.msg);
  }
  return { success: false, data: {}, error: config };
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
    this.middlewares.push(handleSuccessResponse);
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
        const middleware = config?.meta?.middleware;
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
        const { retry: maxRetryCount } = config.meta || {};

        if (maxRetryCount > 0) {
          config.retryCount = config.retryCount ?? 0;

          if (config.retryCount < maxRetryCount) {
            config.retryCount++;
            // 請求延遲避免炸server
            await new Promise((res) => setTimeout(res, 1500));
            return this.axiosInstance.request(error.config);
          }
        }

        return handleErrorResponse(error.config, error.response);
      }
    );
  }
}

const instance = new HttpInstance().axiosInstance;
const postInstance = new HttpInstance(proxyConfig).axiosInstance;

const proxyHttp = {
  get: async ({
    url,
    params,
    meta,
  }: {
    url: string;
    params?: Record<string, any>;
    meta?: Record<string, any>;
  }) => postInstance.get(url, { params, meta } as CustomRequestConfig),
  post: async ({
    url,
    body,
    meta,
  }: {
    url: string;
    body?: Record<string, any>;
    meta?: Record<string, any>;
  }) => postInstance.post(url, { body, meta } as CustomRequestConfig),
};

const http = {
  get: async ({
    url,
    params,
    meta,
  }: {
    url: string;
    params?: Record<string, any>;
    meta?: Record<string, any>;
  }) => instance.get(url, { params, meta } as CustomRequestConfig),
  post: async ({
    url,
    body,
    meta,
  }: {
    url: string;
    body?: Record<string, any>;
    meta?: Record<string, any>;
  }) => instance.post(url, { body, meta } as CustomRequestConfig),
};

export { http, proxyHttp };
