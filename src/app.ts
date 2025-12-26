import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './presistence';
import authRouter from './presentation/api/routers/auth';
import pagesRouter from './presentation/pages/router';

const app = express();

async function startServer() {
  try {
    // external dependencies connection
    await connectDB();

    // middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); // Parse form data
    app.use(cookieParser()); // Parse cookies from request headers

    // Configure EJS template engine
    app.set('view engine', 'ejs');
    app.set('views', './src/presentation/pages/views');

    // routes
    app.use('/api/auth', authRouter);
    app.use('', pagesRouter)

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