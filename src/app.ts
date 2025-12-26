import express from 'express';
import { connectDB } from './presistence';

const app = express();

async function startServer() {
  try {
    // external dependencies connection
    await connectDB();

    // routes
    app.use(express.json());

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