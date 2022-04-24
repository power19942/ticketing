import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@omjk_ticket/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./queue-group";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    await expirationQueue.add({
      orderId: data.id
    })

    msg.ack();
  }

}