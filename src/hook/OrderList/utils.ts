import { OrderStatus } from "@/enum/OrderList";

export const orderStatusLabelMap: Record<OrderStatus, string> = {
  [OrderStatus.NEW]: "待成交",
  [OrderStatus.PARTIALLY_FILLED]: "部分成交",
  [OrderStatus.FILLED]: "已成交",
  [OrderStatus.CANCELED]: "已取消",
  [OrderStatus.REJECTED]: "被拒絕",
  [OrderStatus.EXPIRED]: "已過期",
  [OrderStatus.PENDING_CANCEL]: "取消中",
};