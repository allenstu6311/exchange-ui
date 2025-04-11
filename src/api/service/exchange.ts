import http from "@/api";

export const getTickerBy24hr = async () => {
  const data = await http.get({
    url: "/ticker/24hr",
    params: {},
    meta: {
      onSuccess() {},
      onError() {},
      retry: 3,
      middleware: [
        (config: any, result: any) => {
          console.log("success");
          return result;
        },
      ],
    },
  });
  return data;
};
