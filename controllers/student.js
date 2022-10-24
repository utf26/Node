const Student = require('../Models/Student')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const createStudent = async (req, res) => {
    req.body.createdBy = req.user.userId
    const std = await Student.create(req.body)
    res.status(StatusCodes.CREATED).json({ std })
}
//For Testing, Public Route
const getAllStdP = async (req, res) => {
    const stds = await Student.find().limit(2).sort('createdAt')
    res.status(StatusCodes.OK).json({ stds, count: stds.length })
}

const getAllStds = async (req, res) => {
    const stds = await Student.find({ status: req.body.status }).skip((req.body.page > 0) ? req.body.page*req.body.limit : 0||0).limit(req.body.limit||24).sort(req.body.filter||'createdAt')
    res.status(StatusCodes.OK).json({ stds, count: stds.length })
}

const getStudent = async (req, res) => {
    const {
        params: { id: stdId }
    } = req
    const std = await Student.findOne({
        _id: stdId
    })
    if (!std) {
        throw new NotFoundError(`No Student With Id ${stdId}`)
    }
    res.status(StatusCodes.OK).json({ std })
}

const updateStudent = async (req, res) => {
    const {
        body: {
            email,
            dob,
            name,
            parents_concern,
            emotional_regulation,
            total_hours,
            completed_hours,
            tls,
            lesson_log,
            hour_log,
            case_notes,
            lesson
        },
        user: { userId },
        params: { id: stdId }
    } = req

    if (email === '' || dob === '' || name === '' || parents_concern === '' || emotional_regulation === '' || total_hours === '' || completed_hours === '') {
        throw new BadRequestError('Information Missing')
    }

    // All Attribute Conditions

    // if (tls[0].date === '' || tls[0].program === '' || tls[0].music_day === '' || tls[0].duration === '') {
    //     throw new BadRequestError('TLS Information Missing')
    // }
    // if (lesson_log[0].teacher === '' || lesson_log[0].time === '' || lesson_log[0].date === '') {
    //     throw new BadRequestError('Lesson Log Information Missing')
    // }
    // if (hour_log[0].teacher === '' || hour_log[0].time === '' || hour_log[0].date === '' || hour_log[0].note === '') {
    //     throw new BadRequestError('Hour Log Information Missing')
    // }
    // if (case_notes[0].reviewer === '' || recent_changes[0].time === '' || communication[0].date === '') {
    //     throw new BadRequestError('Case Notes Information Missing')
    // }
    // if (lesson[0].trainer === '' || lesson[0].date === '' || lesson[0].lesson_length === '' || lesson[0].lesson_objectives === '' || lesson[0].message === '' || lesson[0].reflex === '' || lesson[0].tactile === '' || lesson[0].vestibular === '' || lesson[0].oral === '' || lesson[0].kinestesia === '' || lesson[0].muscle_tone === '' || lesson[0].proprioception === '' || lesson[0].vision === '' || lesson[0].emotions === '' || lesson[0].others === '' || lesson[0].plan_for_next_session === '' || lesson[0].parent_feedback === '') {
    //     throw new BadRequestError('Lesson Information Missing')
    // }

    const std = await Student.findOneAndUpdate({
        _id: stdId
    },
        req.body,
        { new: true, runValidators: true }
    )
    if (!std) {
        throw new NotFoundError(`No Student With Id ${stdId}`)
    }
    res.status(StatusCodes.OK).json({ std })
}

const deleteStudent = async (req, res) => {
    const {
        user: { userId },
        params: { id: stdId }
    } = req
    // console.log(userId) //Limit Deletion by role
    const std = await Student.findOneAndRemove({
        _id: stdId,
        createdBy: userId
    })
    if (!std) {
        throw new NotFoundError(`No Student With Id ${stdId}`)
    }
    res.status(StatusCodes.OK).send("Student Has Been Deleted")
}

module.exports = {
    deleteStudent,
    getAllStds,
    getStudent,
    createStudent,
    getAllStdP,
    updateStudent
}