import { Subjects, Publisher, PaymentCreatedEvent } from '@omjk_ticket/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}