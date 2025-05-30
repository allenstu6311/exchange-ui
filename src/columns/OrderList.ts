import { formatNumToFixed } from "@/utils";

  export const currentOrderColumns = [
    {
      label: "交易對",
      key: "symbol",
    },
    {
      label: "方向",
      key: "side",
      format: (content: string) => {
        return content === "BUY" ? "買入" : "賣出";
      },
    },
    {
      label: "類型",
      key: "type",
      format: (content: string) => {
        return content === "LIMIT" ? "限價" : "市價";
      },
    },
    {
      label: "數量",
      key: "origQty",
      format: (content: string) => {
        return formatNumToFixed(content, showPrecision);
      },
    },
    {
      label: "價格",
      key: "price",
      format: (content: string) => {
        return formatNumToFixed(content, showPrecision);
      },
    },
    {
      label: "狀態",
      key: "status",
    },
    {
      label: "時間",
      key: "workingTime",
      format: (content: string) => {
        return dayjs(Number(content)).format("YYYY/MM/DD HH:mm:ss");
      },
    },
    {
      label: "操作",
      key: "operation",
      render: (content: string, rowData: ICurrentOrder) => {
        return (
          <Button
            className=""
            size="xs"
            onClick={() => {
              handleCancelOrder(rowData);
            }}
          >
            取消訂單
          </Button>
        );
      },
    },
  ];