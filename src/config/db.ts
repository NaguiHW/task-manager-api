import mongoose from 'mongoose';

const db = async () => {
  try {
    const conn = await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_APP_NAME}.ptoce.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME}`,
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Error: Unknown error');
    }
    process.exit(1);
  }
};

export default db;
