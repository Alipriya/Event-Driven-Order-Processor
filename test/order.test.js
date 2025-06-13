import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import Order from '../src/models/Order';

describe('Order API', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri(), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await Order.deleteMany({});
    });

    it('should create a new order', async () => {
        const payload = {
            customerId: 'cust123',
            items: [
                { sku: 'A1', quantity: 2, price: 10 },
                { sku: 'B2', quantity: 1, price: 20 }
            ]
        };

        const res = await request(app)
            .post('/orders')
            .send(payload)
            .expect(201);

        expect(res.body).toHaveProperty('_id');
        expect(res.body.customerId).toBe('cust123');
        expect(res.body.items).toHaveLength(2);
    });

    it('should list all orders', async () => {
        await Order.create({ customerId: 'u1', items: [{ sku: 'X', quantity: 1, price: 5 }] });

        const res = await request(app)
            .get('/orders')
            .expect(200);

        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('customerId', 'u1');
    });
});
