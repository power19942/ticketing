import express from 'express';
import 'express-async-errors'
import cookieSession from 'cookie-session'

import { CurrentUserRouter } from './routes/current-user'
import { SignInRouter } from './routes/signin'
import { SignUpRouter } from './routes/signup'
import { SignOutRouter } from './routes/signout'
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  signed: false,
  // secure: process.env.NODE_ENV !== 'test'
}))

app.use(CurrentUserRouter)
app.use(SignInRouter)
app.use(SignUpRouter)
app.use(SignOutRouter)

app.all('*', async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

export {app}