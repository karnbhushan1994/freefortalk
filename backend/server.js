const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorMiddleware');

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // __dirname points to backend/

// Immediate test
console.log('[DEBUG] .env location:', path.join(__dirname, '.env'));
console.log('[DEBUG] JWT_SECRET exists?', !!process.env.JWT_SECRET);


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});