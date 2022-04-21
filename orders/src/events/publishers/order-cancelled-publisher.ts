import { OrderCancelledEvent, Publisher, Subjects } from "@omjk_ticket/common"

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

}