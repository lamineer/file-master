// Required Imports
const express = require('express')
const router = express.Router()
const apiController = require('../controllers/apiController')

router.get("/files", apiController.getFiles)
router.post("/uploadfile", apiController.uploadFile)
router.delete("/deletefile/:file_id", apiController.deleteFile)

module.exports = router