import axios, { type Method } from "axios";
import logger from "@/utils/logger";
import { t } from "i18next";
import { toast } from "react-toastify";

export declare type ActionOption = {
  url: string;
  method?: Method;
  headers?: Record<string, string>;
  data?: Record<string, unknown> | string;
  params?: Record<string, unknown>;
  timeout?: number;
  skipErrorHandle?: boolean | false;
};

export declare type ActionResult<D> = {
  ok: boolean;
  msg?: string;
  code?: string;
  data: D;
};

export declare type ActionExector<D> = (opt: ActionOption) => Promise<D>;

export const provider = axios.create({
  timeout: (process.env.NEXT_PUBLIC_API_TIMEOUT ? parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT) : 30) * 1000,
  baseURL: '/api'
});

provider.interceptors.request.use(async (request) => {
  logger.l(`[api] -> [${request.method}][${request.url}]`, request);

  if (localStorage.getItem("token")) {
    request.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  request.headers.language = localStorage.getItem("i18nextLng") || "en";
  return request;
});

provider.interceptors.response.use(
  async (response) => {
    logger.l(
      `[api] <- [${response.status}][${response.config.url}]`,
      response.data
    );
    return response;
  },
  async (e) => {
    logger.e(`[api] <- [${e.code}]`, e.message);
    if (e.response) {
      if (!e.config.skipErrorHandle) {
        toast.error(t(`errors.${e.response.data.status}`))
      }
      if(e.response.status === 401){
        localStorage.removeItem("token")
      }
      logger.e(
        `[api] <- [${e.response.status}][${e.response.config.url}]`,
        e.status,
        e.message,
        e.response?.data
      );
    } else {
      logger.e(`[api] <- [${e.code}]`, e.message);
    }

    return (
      e.response ?? {
        data: { success: false, message: e.message, status: e.status, data: null },
      }
    );
  }
);

// 包装器
export const action = async <D>(opt: ActionOption) =>
  provider.request<ActionResult<D>>(opt).then((res) => res.data);
