import dotenv from 'dotenv';
import pkg from 'pg';
import 'dotenv/config'

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }

});
pool.on("connect", () => {
  console.log("Connected to database");
});

pool.on("error", (err) => {
  console.error("Database error", err);
});

export default pool;