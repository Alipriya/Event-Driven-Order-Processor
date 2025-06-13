import amqp from 'amqplib';
import Order from '../models/Order.js';
import { sendConfirmation } from '../services/emailService.js';

export const consumeOrderEvents = async () => {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    const ch = await conn.createChannel();
    const q = 'order_created';
    await ch.assertQueue(q);
    ch.consume(q, async (msg) => {
        if (msg) {
            const order = JSON.parse(msg.content.toString());
            console.log('Received order_created event for', order._id);
            // update status
            await Order.findByIdAndUpdate(order._id, { status: 'CONFIRMED' });
            // trigger serverless function for email
            await sendConfirmation(order);
            ch.ack(msg);
        }
    });
};