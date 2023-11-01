// Module Requirements
const db = require('./classes/Database');
const express = require('express');

// Init Express Application
const app = express();

// Configuration
const PORT = 8000;

// Init Express Routes
const routes = require('./routes')(app);

app.listen(PORT, () => {
    console.log(`Backend is running on port: ${PORT}`)
})


db.getUsers();