const User = require("../Models/User")
const bcrypt = require('bcryptjs')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    const FindUser = await User.findOne({
        _id: req.user.userId
    })
    if (FindUser.type == "Admin") {
        const user = await User.create({ ...req.body })
        const token = user.createJWT()
        res.status(StatusCodes.CREATED).json({ user: { id: user._id, name: user.name, email: user.email, type: user.type, designation: user.designation, isHead: user.isHead }, token })
    } else {
        throw new UnauthenticatedError('Insufficient Privileges')
    }
}

const getAllUsers = async (req, res) => {
    const FindUser = await User.findOne({
        _id: req.user.userId
    })
    if (FindUser.type == "Admin") {
        let Users = ""
        if (req.body.search) {
            Users = await User.find({ name: new RegExp(req.body.search,'i'), type: 'Teacher' }, { name: 1, email: 1, type: 1, designation: 1, isHead: 1 }).skip((req.body.page > 0) ? req.body.page * req.body.limit : 0 || 0).limit(req.body.limit || 24).sort(req.body.filter || 'createdAt')
        } else {
            Users = await User.find({ type: 'Teacher' }, { name: 1, email: 1, type: 1, designation: 1, isHead: 1 }).skip((req.body.page > 0) ? req.body.page * req.body.limit : 0 || 0).limit(req.body.limit || 24).sort(req.body.filter || 'createdAt')
        }
        res.status(StatusCodes.OK).json({ Users, count: Users.length })
    } else {
        throw new UnauthenticatedError('Insufficient Privileges')
    }
}

const updateUser = async (req, res) => {
    const {
        body: { name, email, password, type, designation, isHead },
        user: { userId },
        params: { id: PId }
    } = req
    const FindUser = await User.findOne({
        _id: userId
    })
    if (FindUser.type == 'Admin' || userId == PId) {
        if (name || email) {
            if (name === '' || email === '') {
                throw new BadRequestError('Fields Cannot be Empty')
            }
        }
        if (password) {
            if (password === '') {
                throw new BadRequestError('Fields Cannot be Empty')
            }
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        if (type || designation || isHead) {
            if (FindUser.type == "Admin") {
                if (type === '' || designation === '' || isHead === '') {
                    throw new BadRequestError('Fields Cannot be Empty')
                }
            } else {
                throw new UnauthenticatedError('Insufficient Privileges')
            }
        }
        const user = await User.findOneAndUpdate({
            _id: PId
        },
            req.body,
            { new: true, runValidators: true }
        )
        if (!user) {
            throw new NotFoundError(`No User With Id ${PId}`)
        }
        res.status(StatusCodes.OK).json("Updated")
    } else {
        throw new UnauthenticatedError('Invalid user ID')
    }
}

const getUser = async (req, res) => {
    const {
        user: { userId },
        params: { id: UId }
    } = req
    const FindUser = await User.findOne({
        _id: userId
    })
    if (FindUser.type == "Admin") {
        const user = await User.findOne({
            _id: UId
        })
        if (!user) {
            throw new NotFoundError(`No User With Id ${UId}`)
        }
        res.status(StatusCodes.OK).json({ user: { name: user.name, email: user.email, type: user.type, designation: user.designation, isHead: user.isHead } })
    } else {
        throw new UnauthenticatedError('Insufficient Privileges')
    }

}

const deleteUser = async (req, res) => {
    const {
        user: { userId },
        params: { id: UId }
    } = req
    const FindUser = await User.findOne({
        _id: userId
    })
    if (FindUser.type == "Admin") {
        const user = await User.findOneAndRemove({
            _id: UId
        })
        if (!user) {
            throw new NotFoundError(`No User With Id ${UId}`)
        }
        res.status(StatusCodes.OK).send("User has been Deleted")
    } else {
        throw new UnauthenticatedError('Insufficient Privileges')
    }
}

module.exports = {
    register,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers
} 