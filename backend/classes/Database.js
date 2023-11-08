const fs = require('fs');
const sqlite3 = require('sqlite3').verbose()

class Database {

    db = new sqlite3.Database("database.db")
    
    constructor(){}

    initDb(){
        if(!fs.existsSync("database.db")){
            this.db.serialize(() => {
                this.db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, lastLogin INTEGER)")
                this.db.run("CREATE TABLE userFiles (id INTEGER PRIMARY KEY, fileName TEXT UNIQUE NOT NULL, fileType TEXT NOT NULL, user_id INTEGER NOT NULL, fileSize INTEGER, uploadTime INTEGER)")
                this.db.run("CREATE TABLE user_sessions (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, session_token TEXT UNIQUE NOT NULL, expirationTime INTEGER)")
                this.db.run("INSERT INTO USERS (username, password) VALUES ('admin', '$2a$12$yQacmRokAp0CxEq/khBB8u/VElCD2bWyj0VKXenavwKn1CU7tTEQa')")
            })
        } else {
            console.log("database.db file already exits!")
        }
    } 
    
}

module.exports = new Database();