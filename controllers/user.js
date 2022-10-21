const User = require("../Models/User")
const bcrypt = require('bcryptjs')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const updateUser = async (req, res) => {
    const {
        body: { name, email, password},
        user: { userId },
        params: { id: PId }
    } = req
    if (userId !== PId) {
        throw new BadRequestError('Invalid user ID')
    }
    if (name === '' || email === '' || password === '') {
        throw new BadRequestError('Fields Cannot be Empty')
    }
    const salt = await bcrypt.genSalt(10)
    req.body.password = await bcrypt.hash(req.body.password, salt)
    const user = await User.findOneAndUpdate({
        _id: PId
    },
    req.body,
    {new:true,runValidators:true}
    )
    if (!user) {
        throw new NotFoundError(`No Job With Id ${PId}`)
    }
    res.status(StatusCodes.OK).json("Updated")
}

const getUser = async (req, res) => {
    const {
        params: { id: userId }
    } = req
    const user = await User.findOne({
        _id: userId
    })
    if (!user) {
        throw new NotFoundError(`No User With Id ${userId}`)
    }
    res.status(StatusCodes.OK).json({ user: { name: user.name, email: user.email, type: user.type, designation: user.designation }})
}

module.exports = {
    updateUser,
    getUser
} 