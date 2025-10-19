import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to database successfully");
    client.release();
  } catch (error) {
    console.error(`Cannot connect to the database: ${error}`);
  }
};

await connectDB();

export default pool;
