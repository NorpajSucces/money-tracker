// Fix DNS resolver Node.js (mengatasi ECONNREFUSED pada SRV lookup)
const { setServers } = require('node:dns');
setServers(['1.1.1.1', '8.8.8.8']);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Restrict CORS ke origin frontend saja
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.use(express.json());

app.use('/api', router);
app.use(errorHandler);

// Mulai server hanya setelah MongoDB terhubung
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected ✅');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed ❌', err.message);
    process.exit(1);
  });