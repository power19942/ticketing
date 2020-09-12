import express from 'express';
import 'express-async-errors'
import mongoose from 'mongoose'

import { CurrentUserRouter } from './routes/current-user'
import { SignInRouter } from './routes/signin'
import { SignUpRouter } from './routes/signup'
import { SignOutRouter } from './routes/signout'
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use(CurrentUserRouter)
app.use(SignInRouter)
app.use(SignUpRouter)
app.use(SignOutRouter)

app.all('*', async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('connected to auth DB')
  } catch (error) {
    console.error(error)
  }

  app.listen(3000, () => {
    console.log('listen on port 3000');
  })
}

start()