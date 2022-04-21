import express from 'express';
import 'express-async-errors'
import cookieSession from 'cookie-session'

import { CurrentUserRouter } from './routes/current-user'
import { SignInRouter } from './routes/signin'
import { SignUpRouter } from './routes/signup'
import { SignOutRouter } from './routes/signout'
import { errorHandler,NotFoundError } from '@omjk_ticket/common';

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  signed: false, // we will store jwt inside the cookie so we dont need the cookie to encrypt the data 
  //becuse th jwt is already encrypted

  // secure: process.env.NODE_ENV !== 'test' // this mean that the cookie should serve by https
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