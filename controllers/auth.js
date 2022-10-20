const User = require("../Models/User")
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name, email: user.email, role: user.role }, token })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please Provide Email and Password')
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user, token })
}

const updateUser = async (req, res) => {
    const {
        body: { name, email, password},
        user: { userId },
        params: { id: PId }
    } = req
    console.log(req)
    if (userId !== PId) {
        throw new BadRequestError('Invalid user ID')
    }
    if (name === '' || email === '' || password === '') {
        throw new BadRequestError('Fields Cannot be Empty')
    }
    const user = await User.findOneAndUpdate({
        _id: PId
    },
    req.body,
    {new:true,runValidators:true}
    )
    if (!user) {
        throw new NotFoundError(`No Job With Id ${PId}`)
    }
    res.status(StatusCodes.OK).json({ user })
}

module.exports = {
    register,
    login,
    updateUser
} 