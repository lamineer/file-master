const db = require('../classes/Database').db;
const fn = require('./functions');
const fs = require('fs');

exports.getFiles = (req, res) => {
    try{
        db.all("SELECT * FROM userFiles WHERE user_id = ?", [ res.locals.user_id ], (err, rows) => {
            if(err) {console.error(err); res.send("Error has occured in query!")}
            if(rows) res.json(rows)
            else res.json({})
        })
    } catch (err) {
        console.error(err)
    }
}

exports.uploadFile = (req, res) => {
    var fileData = [], totalBytes = 0;
    console.log(req.headers)
    var file = fs.createWriteStream(`./uploads/${res.locals.user_id}/file.png`)
    req.on('data', function(chunk){
        file.write(chunk)
        totalBytes += chunk.length;
    })
    req.on('end', function(){
        res.send("File uploaded!")
        console.log("File Upload Ended!")
    })
}