// 导入express
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入用户信息的处理函数模块
const userinfo_handler = require('../router-handler/userinfo')

// 获取用户的基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)

// 更新用户的基本信息
router.post('/userinfo', userinfo_handler.updateUserInfo)

// 重置密码的路由
router.post('/updated', userinfo_handler.updatedPassword)

// 更換頭像的路由
router.post('/update/avatar', userinfo_handler.updateAvatar)

// 向外共享路由对象
module.exports = router