// Requirements
const db = require('./classes/Database').initDb();
const CustomHTTP = require('./classes/CustomHTTP');

// Configuration
const HOST = "localhost";
const PORT = 8000;

const server = new CustomHTTP(HOST, PORT)
server.startWebServer()
