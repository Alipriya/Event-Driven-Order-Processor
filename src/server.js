import http from 'http';
import { connectDB } from './config/db.js';
import app from './app.js';
import { consumeOrderEvents } from './events/orderEventHandler.js';
import dotenv from 'dotenv';

dotenv.config();
connectDB();
// start consumer
consumeOrderEvents();
// start HTTP server
const server = http.createServer(app);
server.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));