import axios, {
  //   AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
// import CryptoJS from "crypto-js";

// const API_KEY =
//   "UTj7iVVEx6nMyhJQiUyyIYW6GxUDXlGMcvVnzhOmlR3mktMBA5N2qk2B4EoIfSfn";
// const SECRET_KEY =
//   "4mSUiEArmbdTraMjjAuQYM0g1dVL4EH44UvIhyYXaoXmZblg1ZWtlv08wW4QMk9h";

interface CustomRequestConfig extends AxiosRequestConfig {
  meta?: Record<string, any>;
}

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  meta?: Record<string, any>;
}

const defauktConfig: AxiosRequestConfig = {
  baseURL: "https://testnet.binance.vision/api/v3",
  timeout: 10000,
  // headers: {
  //     'X-MBX-APIKEY': API_KEY
  // }
};

// const createSignature = (params: Record<string, string>) => {
//     const query = new URLSearchParams(params).toString();
//     return CryptoJS.HmacSHA256(query, SECRET_KEY).toString();
//   };

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
        alert(response.data.msg);
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
    onError(config);
  } else {
    alert(response.msg);
  }
  return { success: false, data: {}, error: config };
}

class HttpInstance {
  /**重試次數 */
  private retryCount: number = 0;

  /**最大重複次數 */
  private maxRetryCount = 3;

  /**請求實體 */
  public axiosInstance: AxiosInstance = axios.create(defauktConfig);

  /**當前請求配置 */
  private currRequestConfig: AxiosRequestConfig | null = null;

  private middlewares: Middleware<any>[] = [];

  private addMiddleware(middleware: Middleware<any>[]) {
    this.middlewares = [...this.middlewares, ...middleware];
  }

  constructor() {
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
        this.currRequestConfig = config;

        const middleware = config?.meta?.middleware;
        if (middleware) {
          this.addMiddleware(middleware);
        }

        return config;
      },
      (error) => {
        // 失敗時自動retry
        if (this.retryCount < this.maxRetryCount) {
          this.retryCount++;
          return this.axiosInstance.request(this.currRequestConfig!);
        }
        this.retryCount = 0;
        return Promise.reject(error);
      }
    );
  }

  private httpInterceptorsResponse() {
    this.axiosInstance.interceptors.response.use(
      async (response) => {
        this.retryCount = 0;
        return this.runMiddlewares(response.config, response);
      },
      (error) => {
        return handleErrorResponse(error.config, error.response);
      }
    );
  }
}

const instance = new HttpInstance().axiosInstance;

const http = {
  get: async ({
    url,
    params,
    meta = {},
  }: {
    url: string;
    params?: Record<string, any>;
    meta?: Record<string, any>;
  }) => instance.get(url, { params, meta } as CustomRequestConfig),
  post: async (url: string, data?: Record<string, any>) =>
    instance.post(url, data),
};

export default http;
