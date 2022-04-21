import express from 'express';
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@omjk_ticket/common';
import { IndexOrderRouter } from './routes/index'
import { NewOrderRouter } from './routes/new'
import { ShowOrderRouter } from './routes/show'
import { DeleteOrderRouter } from './routes/delete'


const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  signed: false,
  // secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUser)
app.use(IndexOrderRouter)
app.use(NewOrderRouter)
app.use(ShowOrderRouter)
app.use(DeleteOrderRouter)

app.all('*', async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }