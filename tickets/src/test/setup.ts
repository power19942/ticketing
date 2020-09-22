import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest';
import jwt from 'jsonwebtoken'
import { app } from '../app'

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[]
    }
  }
}

jest.mock('../nats-wrapper')
let mongo: any
beforeAll(async () => {
  jest.clearAllMocks()
  process.env.JWT_KEY = 'asdfasdf'
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// fake signin
global.signin = () => {
  //build a JWT payload. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'mail@mail.com'
  }
  //create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  //build session object {jwt: my_jwt}
  const session = { jwt: token }
  //turn that session into JSON
  const sessionJSON = JSON.stringify(session)
  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')
  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`]
}