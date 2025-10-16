import express from 'express';   // or: const express = require('express');
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config(); // load .env file

const app = express();

// middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // parse JSON bodies

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// choose port
const PORT = process.env.PORT || 3000;

// start the server
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
