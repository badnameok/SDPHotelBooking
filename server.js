const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({path:'./config/config.env'});
connectDB();

const app = express();

app.get('/api/v1/hotels', (req, res) => {
    res.status(200).json({success: true, msg: 'Show all hotels'});
});

app.get('/api/v1/hotels/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Show hotel ${req.params.id}`});
});

app.post('/api/v1/hotels', (req, res) => {
    res.status(200).json({success: true, msg: 'Create new hotel'});
});

app.put('/api/v1/hotels/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Update hotel ${req.params.id}`});
});

app.get('/', (req, res) => {
    res.status(200).json({success: true, msg: 'Hello World'});
});

app.delete('/api/v1/hotels/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Delete hotel ${req.params.id}`});
});


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});