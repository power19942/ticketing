import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@omjk_ticket/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./queue-group";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    const delay = new Date(data.expireAt).getTime() - new Date().getTime();
    console.log('waiting this many milliseconds to process the job:', delay)

    await expirationQueue.add({
      orderId: data.id
    },{
      delay
    })

    msg.ack();
  }

}