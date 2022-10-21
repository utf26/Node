const express = require('express')
const router = express.Router()

const {updateUser} = require("../controllers/user")
const {getUser} = require("../controllers/user")

router.post('/update/:id',updateUser)
router.route('/getUser/:id').get(getUser)

module.exports = router