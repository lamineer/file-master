// Requirements
const db = require('./classes/Database').initDb();
const CustomHTTP = require('./classes/CustomHTTP');

// Configuration
const HOST = "localhost";
const PORT = 8000;

const http = new CustomHTTP(HOST, PORT)

const server = http.createServer(this.requestListener);
server.listen(this.#PORT, this.#HOST, () => {
    console.log(`Server is running on http://${this.#HOST}:${this.#PORT}`);
});
