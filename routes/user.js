const express = require('express')
const router = express.Router()

const {updateUser, getUser, deleteUser} = require("../controllers/user")

router.patch('/update/:id',updateUser)
router.route('/getUser/:id').get(getUser).delete(deleteUser)

module.exports = router