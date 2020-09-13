import mongoose from 'mongoose'
import {app} from './app'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not defined')
  }
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