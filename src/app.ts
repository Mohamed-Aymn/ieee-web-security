import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './presistence';
import authRouter from './presentation/routers/auth';

const app = express();

async function startServer() {
  try {
    // external dependencies connection
    await connectDB();

    // middlewares
    app.use(express.json());
    app.use(cookieParser()); // Parse cookies from request headers

    // routes
    app.use('/auth', authRouter);

    // app start
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Failed to connect to DB', error);
    process.exit(1); // Exit if DB fails
  }
}

startServer();