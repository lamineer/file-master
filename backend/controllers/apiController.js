const db = require('../classes/Database').db;

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

}