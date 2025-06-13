import axios from 'axios';
export const sendConfirmation = async (order) => {
    await axios.post(process.env.SERVICE_URL + '/sendEmail', {
        apiKey: process.env.EMAIL_API_KEY,
        to: order.customerId,
        subject: 'Order Confirmed',
        body: `Your order ${order._id} is confirmed.`
    });
};