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
                res.json({ error: "Error occured while checking authentication!", code: 500})
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
        if(username == "" || password == ""){
            res.json({error: "Username or password missing.", code: 404})
        } else {
            db.get("SELECT * FROM users WHERE username = ?", [ username ], (err, rows) => {
                if(err) {
                    console.error(err)
                    res.json({ error: "Error occured while logging in!", code: 500})
                } 
                if (rows) {
                    bcrypt.compare(password, rows.password, (err, result) => {
                        if(result){
                            var token = fn.generateString(128);
                            var expireTime = Date.now() + (24*60*60*1000)
                            db.run("INSERT INTO user_sessions (user_id, session_token, expirationTime) VALUES (?, ?, ?)", [rows.id, token, expireTime])
                            db.run("UPDATE users SET lastLogin = ? WHERE id = ?", [ Date.now(), rows.id ])
                            res.json({ session_token: token, expireTime: expireTime, code: 200})
                        } else {
                            res.json({ error: "Wrong username or password!", code: 500})
                        }
                    })
                } else {
                    res.json( { error: "User was not found!", code: 404 })
                }
            })
        }
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
                res.json({ message: "Logout failed", code: 500})
            } else {
                res.json({ message: "Logout was successful!", code: 200})
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
                    if(err.errno == 19) res.json({ message: "Username: <b>" + username + "</b> is already registered!", code: 409})
                    else res.json({ message: username + " failed to register!", code: 500 })
                }
                else res.json({ message: username + " was registered successfuly!", code: 200 })
            });
        });
    } catch (err) {
        console.error(err)
    }
}