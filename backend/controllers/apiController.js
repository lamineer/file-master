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
    try{
        var totalBytes = 0;
        var temp = path.resolve(os.tmpdir(), fn.generateString(16));
        if(req.headers["content-type"].includes("multipart/form-data")){
            req.pipe(fs.createWriteStream(temp, (err) => console.log(err))) 
            req.on('end', function(){
                newData = fn.getFileData(fs.readFileSync(temp, (err) => console.log(err)))
                if(newData.fileName == '' && newData.fileType == ''){
                    console.log(newData)
                    res.send("Filename or fileType is missing!")
                } else {
                    fs.writeFileSync(`./uploads/${res.locals.user_id}/${newData.fileName}`, newData.data)
                    res.send(`File ${newData.fileName} uploaded! Total file size: ${totalBytes} bytes`)
                }
                fs.unlinkSync(temp);
            })
        } else {
            res.send("No file was inputted!")
        }
    } catch (err) {
        console.error(err)
        res.send("Error occured while uploading file! Please try again!")
    }

}