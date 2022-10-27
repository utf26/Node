const express = require('express')
const router = express.Router()

const { updateUser, getUser, deleteUser, register, getAllUsers } = require("../controllers/user")

router.patch('/update/:id', updateUser)
router.route('/getUser/:id').get(getUser).delete(deleteUser)
router.get('/users', getAllUsers)
router.post('/register', register)

module.exports = router