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
        var temp = path.resolve(os.tmpdir(), fn.generateString(16));
        if(req.headers["content-type"].includes("multipart/form-data")){
            var writeStream = fs.createWriteStream(temp)
            req.pipe(writeStream) 
            writeStream.on("finish", () => {
                fileData = fn.getFileData(fs.readFileSync(temp, (err) => console.log(err)))
                if(fileData.fileName == '' && fileData.fileType == ''){
                    res.send("Filename or fileType is missing!")
                } else {
                    var filePath = `./uploads/${res.locals.user_id}/`
                    var count = 0,
                        tempRegex = fileData.fileName.match(/(?<fileName>.+?)(?<fileExtension>\.[^.]*$|$)/s);;
                    while(fs.existsSync(filePath+fileData.fileName)){
                        
                        fileData.fileName = `${tempRegex.groups.fileName} (${count})${tempRegex.groups.fileExtension}`;
                        count++;
                    }
                    fs.writeFileSync(`${filePath+fileData.fileName}`, fileData.data)
                    db.run(`INSERT INTO userFiles(fileName, fileType, user_id, fileSize, uploadTime) VALUES (?, ?, ?, ?, ?)`, [
                        fileData.fileName, 
                        fileData.fileType,
                        res.locals.user_id,
                        fileData.fileSize,
                        Date.now()
                    ], (err) => {
                        if(err) {
                            fs.unlink(`${filePath+fileData.fileName}`, fsErr => console.log(fsErr))
                            res.send(`${fileData.fileName} upload was unsuccessful`)
                        }
                        else res.send(`${fileData.fileName} uploaded! Total file size: ${fileData.fileSize} bytes`)
                    })
                }
                fs.unlinkSync(temp);
            })
        } else {
            res.send("This is not a file!")
        }
    } catch (err) {
        console.error(err)
        res.send("Error occured while uploading file! Please try again!")
    }

}