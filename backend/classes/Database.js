const sqlite3 = require('sqlite3')

class Database {

    #db = new sqlite3.Database(":memory:")
    
    constructor(){
        this.#db.serialize(() => {
            this.#db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, lastLogin TEXT)")
            this.#db.run("CREATE TABLE userFiles (id INTEGER PRIMARY KEY, fileName TEXT, fileType TEXT, user_id INTEGER, fileSize INTEGER, uploadTime TEXT)")
            this.#db.run("CREATE TABLE user_sessions (id INTEGER PRIMARY KEY, user_id INTEGER, session_token TEXT, expirationTime INTEGER)")
            this.#db.run("INSERT INTO USERS (username, password) VALUES ('admin', '$2a$12$yQacmRokAp0CxEq/khBB8u/VElCD2bWyj0VKXenavwKn1CU7tTEQa')")
        })
    }

    getUsers(){
        this.#db.get("SELECT * FROM USERS", (err , rows) => {
            if (rows) console.log(rows)
            else console.log(err)
        })
    }

}

module.exports = new Database();