// server/server.js
import express, { json } from 'express';
import cors from 'cors';
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(json());

// Sample route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
