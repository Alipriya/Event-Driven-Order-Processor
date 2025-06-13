import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerId: String,
    items: [{ sku: String, quantity: Number, price: Number }],
    status: { type: String, default: 'PENDING' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
