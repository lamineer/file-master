const db = require('../classes/Database').db;
const fn = require('./functions');
const fs = require('fs');
const os = require('os');
const path = require('path');

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
    var totalBytes = 0;
    var temp = path.resolve(os.tmpdir(), 'temp' + Math.floor(Math.random() * 10));
    if(req.headers["content-type"].includes("multipart/form-data")){
        req.pipe(fs.createWriteStream(temp))
        req.on('end', function(){
            newData = fn.getFileData(fs.readFileSync(temp, (err) => console.log(err)))
            if(newData.fileName == ''){
                res.send("Filename is missing!")
            } else {
                fs.writeFileSync(`./uploads/${res.locals.user_id}/${newData.fileName}`, newData.data)
                res.send(`File ${newData.fileName} uploaded! Total file size: ${totalBytes} bytes`)
            }
        })
    } else {
        res.send("No file was inputted!")
    }

}