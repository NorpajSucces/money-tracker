// Fix DNS resolver Node.js (mengatasi ECONNREFUSED pada SRV lookup)
const { setServers } = require('node:dns');
setServers(['1.1.1.1', '8.8.8.8']);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();

const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.use(express.json());

// Menggunakan semua routing yang diatur dari routes/index.js
app.use('/api', router);

app.use(errorHandler);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed ❌", err);
  });