// Required Imports
const express = require('express')
const router = express.Router()
const apiController = require('../controllers/apiController')

router.get("/files", apiController.getFiles)
router.post("/uploadfile", apiController.uploadFile)


module.exports = router