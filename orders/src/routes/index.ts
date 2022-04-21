import { requireAuth } from '@omjk_ticket/common'
import { Router, Request, Response } from 'express'
import { Order } from '../models/order'

const router = Router()

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.find({
    userId: req.currentUser!.id
  })
    .populate('ticket')
  res.send(order)
})


export { router as IndexOrderRouter }