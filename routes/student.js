const express = require('express')
const router = express.Router()

const { deleteStudent,getAllStds, getStudent,createStudent,updateStudent } = require("../controllers/student")

router.route('/').post(createStudent).get(getAllStds)
router.route('/:id').get(getStudent).delete(deleteStudent).patch(updateStudent)

module.exports = router