// Import requirements
const bcrypt = require('bcrypt');
const db = require('../classes/Database').db;
const fn = require('./functions');

exports.checkAuth = (req, res, next) => {
    try{
        var token = req.cookies.token;
        var currentTime = Date.now();
        db.get("SELECT user_id FROM user_sessions WHERE session_token = ? AND expirationTime > ?", [ token, currentTime ], (err, rows) => {
            if(err) {
                console.error(err)
                res.send("Error has occured in authentication!")
            } else {
                if(rows){
                    res.locals.user_id = rows.user_id
                    next()
                } else {
                    res.json({ error: "Unauthorized", code: 401})
                }
            }
        })
    } catch (err) {
        console.error(err)
    }
}

exports.login = (req, res) => {
    try{
        const { username, password } = req.body;
        db.get("SELECT * FROM users WHERE username = ?", [ username ], (err, rows) => {
            if(err) {
                console.error(err)
                res.send("Error has occured in login! Please try again!")
            } else {
                bcrypt.compare(password, rows.password, (err, result) => {
                    if(result){
                        var token = fn.generateString(128);
                        var expireTime = Date.now() + (24*60*60*1000)
                        db.run("INSERT INTO user_sessions (user_id, session_token, expirationTime) VALUES (?, ?, ?)", [rows.id, token, expireTime])
                        db.run("UPDATE users SET lastLogin = ? WHERE user_id = ?", [ Date.now(), rows.id ])
                        res.json({ session_token: token})
                    } else {
                        res.json({ error: "Wrong username or password!"})
                    }
                })
            }
        })
    } catch (err) {
        console.error(err)
    }
}

exports.logout = (req, res) => {
    try{
        var token = req.cookies.token;
        db.run("UPDATE user_sessions SET expirationTime = ? WHERE session_token = ?", [ Date.now(), token ], (err, rows) => {
            if(err){
                console.error(err)
                res.send("Error has occured in query!")
            } else {
                res.send("Logout was successful!")
            }
        })
    } catch (err) {
        console.error(err)
    }
}

exports.registerUser = (req, res) => {
    try{
        const { username, password } = req.body;
        bcrypt.hash(password, 12, (err, hash) => {
            db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hash], (err) => {
                if(err) {
                    if(err.errno == 19) res.send(username + " user is already registered!")
                    else res.send("Error: Adding user failed!")
                }
                else res.send("USER ADDED!")
            });
        });
    } catch (err) {
        console.error(err)
    }
}