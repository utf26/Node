const User = require("../Models/User")
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
    updateUser
} 