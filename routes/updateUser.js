const express = require('express')
const router = express.Router()

const {updateUser} = require("../controllers/updateUser")

router.post('/update/:id',updateUser)

module.exports = router