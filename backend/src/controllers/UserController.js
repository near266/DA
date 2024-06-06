const UserService = require('~/services/UserService')
const JwtService = require('~/services/JwtService')

const createUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!name || !email || !password || !phoneNumber) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is not email'
            })
        }
        //console.log('isCheckEmail', isCheckEmail)
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "controller Error"
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { password, phoneNumber } = req.body
        //const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        //const isCheckEmail = reg.test(email)
        if (!password || !phoneNumber) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } /*else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is not email'
            })
        }*/
        //console.log('isCheckEmail', isCheckEmail)
        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newResponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        })
        return res.status(200).json(newResponse)
    } catch (e) {
        return res.status(404).json({
            message: "controller Error"
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            resolve({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "controller Error"
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            resolve({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "controller Error"
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "controller Error"
        })
    }
}

const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            resolve({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "controller Error"
        })
    }
}

const refreshToken = async (req, res) => {
    console.log('req.cookies', req.cookies)
    try {
        let token = req.cookies.refresh_token
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    refreshToken,
    logoutUser
}