import { ExpirationCompleteEvent, Publisher, Subjects } from "@omjk_ticket/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}