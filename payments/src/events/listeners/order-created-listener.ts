import { Listener, OrderCreatedEvent, Subjects } from "@omjk_ticket/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, version, userId, ticket:{price}, status } = data;

    const order = Order.build({
      id,
      version,
      userId,
      price,
      status,
    });

    await order.save();

    msg.ack();
  }
}