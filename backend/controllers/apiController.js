const db = require('../classes/Database').db;
const fn = require('./functions');
const fs = require('fs');
const os = require('os');
const path = require('path');

exports.downloadFile = (req, res) => {
    try{
        const { file_id } = req.params;
        var filePath = `./uploads/${res.locals.user_id}/`
        db.get("SELECT * FROM userFiles WHERE id = ? AND user_id = ?", [ file_id, res.locals.user_id], (err, rows) => {
            if(err) res.json({ message: "Error occured while trying to download file!", code: 500 })
            if(rows) res.download(`${filePath+rows.fileName}`)
            else res.json({ message: "File not found!", code: 404 })
        })
    } catch (err) {
        console.log(err)
        res.json({ message: "Error occured while trying to download file!", code: 500 })
    }
} 

exports.getFiles = (req, res) => {
    try{
        const { column, sortdir, page } = req.query
        if(column && sortdir){
            var query = `SELECT * FROM userFiles WHERE user_id = ? ORDER BY ${column} COLLATE NOCASE ${sortdir} LIMIT 10`
        } else {
            var query = "SELECT * FROM userFiles WHERE user_id = ? LIMIT 10"
        }
        if(page && !isNaN(page && page < 1000)){
            query += " OFFSET " + ((page-1) * 10)
            console.log(query)
        }
        db.get("SELECT COUNT(*) as count FROM userFiles WHERE user_id = ?", [ res.locals.user_id ], (err, rowCount) => {
            db.all(query, [ res.locals.user_id ], (err, rows) => {
                if(err) {console.error(err); res.json({ message: "Error has occured in query!", code: 500})}
                if(rows) res.json({ fileCount: rowCount.count, data: rows })
                else res.json({})
            })
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
                    res.json({ message: "Filename or fileType is missing!", code: 500})
                } else if(fileData.data.toString() == "undefined"){
                    res.json({ message: "Nohting was sent here!", code: 204})
                } else {
                    var filePath = `./uploads/${res.locals.user_id}/`
                    if(!fs.existsSync(filePath)) fs.mkdirSync(filePath)
                    var count = 0,
                        tempRegex = fileData.fileName.match(/(?<fileName>.+?)(?<fileExtension>\.[^.]*$|$)/s);;
                    while(fs.existsSync(filePath+fileData.fileName)){
                        fileData.fileName = `${tempRegex.groups.fileName} (${count})${tempRegex.groups.fileExtension}`;
                        count++;
                    }
                    fs.writeFileSync(`${filePath+fileData.fileName}`, fileData.data, err => err)
                    db.run(`INSERT INTO userFiles(fileName, fileType, user_id, fileSize, uploadTime) VALUES (?, ?, ?, ?, ?)`, [
                        fileData.fileName, 
                        fileData.fileType,
                        res.locals.user_id,
                        fileData.fileSize,
                        Date.now()
                    ], (err) => {
                        if(err) {
                            fs.unlink(`${filePath+fileData.fileName}`, fsErr => console.log(fsErr))
                            res.json({ message: `${fileData.fileName} upload was unsuccessful`, code: 200})
                        }
                        else res.json({ message: `${fileData.fileName} uploaded! Total file size: ${fileData.fileSize} bytes`, code: 200})
                    })
                }
                fs.unlinkSync(temp);
            })
        } else {
            res.json({message: "This is not a file!", code: 500})
        }
    } catch (err) {
        console.error(err)
        res.json({message: "Error occured while uploading file! Please try again!", code: 500 })
    }
}

exports.deleteFile = (req, res) => {
    try{
        const { file_id } = req.params;
        var filePath = `./uploads/${res.locals.user_id}/`
        db.get("SELECT * FROM userFiles WHERE id = ? AND user_id = ?", [ file_id, res.locals.user_id ], (err, rows) => {
            if(err) res.json({message: "Couldn't find the file, that you're trying to delete", code: 404})
            else {
                db.run("DELETE FROM userFiles WHERE id = ? AND user_id = ?", [ file_id, res.locals.user_id ], (err) => {
                    if(err) res.json({message: "Error occured while deleting file! Please try again!", code: 500})
                    else {
                        fs.unlink(`${filePath+rows.fileName}`, fsErr => console.log(fsErr));
                        res.json({message: "File was deleted successfuly!", code: 200})
                    }
                })
            }
        })
    } catch (err) {
        console.log(err)
        res.json({message: "Error occured while deleting file! Please try again!", code: 500})
    }
}