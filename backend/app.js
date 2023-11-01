// Module Requirements
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const db = require('./classes/Database').initDb()
const fs = require('fs');
const express = require('express');

// Init Express Application
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser())

// Configuration
const PORT = 8000;

// Check if uploads folder exists, if not create it
if(!fs.existsSync("uploads")){
    fs.mkdirSync("uploads");
}

// Init Express Routes
require('./routes/default')(app);

app.listen(PORT, () => {
    console.log(`Backend is running on port: ${PORT}`)
})