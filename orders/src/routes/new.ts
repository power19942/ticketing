import mongoose from 'mongoose'
import { Router, Request, Response } from 'express'
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@omjk_ticket/common'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket'
import { Order } from '../models/order'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body
    //find the ticket
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    //check if the ticket is reserved 
    const isReserved = await ticket.isReserved()

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }

    //calculate order expiration date 'expiration date before user confirm the payment for the order'
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // build the order and save it
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket
    })

    await order.save()

    new OrderCreatedPublisher(natsWrapper.client)
      .publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expireAt: order.expiresAt.toISOString(),
        version: order.ticket.version,
        ticket: {
          id: ticket.id,
          price: ticket.price
        }
      })

    res.status(201).send(order)
  })


export { router as NewOrderRouter }