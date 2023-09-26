import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import 'dotenv/config';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';

const app = express();

app.use(cors({
    credentials: true
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(helmet());
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

const server = http.createServer(app);

server.listen(8080, () => {
    console.log("Server running on http://localhost:8080/");
});

const MONGO_DEV_URL = 'mongodb+srv://cartersk23:GZoaPBY9iBiE8Wl0@cluster0.nrmxdit.mongodb.net/?retryWrites=true&w=majority';
const mongoDB = process.env.MONGODB_URI || MONGO_DEV_URL;

mongoose.Promise = Promise;
mongoose.connect(mongoDB);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());
