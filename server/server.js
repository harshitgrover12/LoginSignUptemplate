const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Configuration
// ================================================================================================

// Set up Mongoose
mongoose.connect('mongodb://localhost/user');
mongoose.Promise = global.Promise;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// API routes
require('./routes')(app);

app.listen(process.env.port||4000,function(){
    console.log('listening for requests');
});

app.use(express.static(path.resolve(__dirname, '../build')));

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../build/index.html'));
    res.end();
});





module.exports = app;