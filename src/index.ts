import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import { config } from 'dotenv';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';

const app = express();
config();

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

const mongoDB = process.env.MONGODB_URI;

mongoose.Promise = Promise;
mongoose.connect(String(mongoDB));
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());
