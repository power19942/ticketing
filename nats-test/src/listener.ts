import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'
console.clear()

let stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
})

stan.on('connect', () => {
  console.log('listiner connected')

  stan.on('close', () => {
    console.log('Nats closed')
    process.exit()
  })

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('order-service')

  let subscribe = stan.subscribe(
    'ticket:created',
    'queue-group-name',
    options)
  subscribe.on('message', (msg: Message) => {
    console.log(msg.getSequence(), msg.getData())

    msg.ack()
  })
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())