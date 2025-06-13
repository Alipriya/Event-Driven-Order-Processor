import Order from '../models/Order.js';
import amqp from 'amqplib';

export const createOrder = async (req, res) => {
    const order = await Order.create(req.body);
    // publish event
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    const ch = await conn.createChannel();
    const q = 'order_created';
    await ch.assertQueue(q);
    ch.sendToQueue(q, Buffer.from(JSON.stringify(order)));
    await ch.close();
    res.status(201).json(order);
};

export const getOrders = async (req, res) => {
    const orders = await Order.find().sort('-createdAt');
    res.json(orders);
};