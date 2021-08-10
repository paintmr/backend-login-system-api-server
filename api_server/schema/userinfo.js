const Joi = require('joi')

// 更新用户信息的驗證規則對象
exports.update_userinfo_schema = Joi.object({
  // 表示需要對req.body中的數據進行驗證
  id: Joi.number().integer().min(1).required(),
  nickname: Joi.string().required(),
  email: Joi.string().email().required()
})

// 更新密碼校驗規則
exports.update_password_schema = Joi.object({
  // 表示需要對req.body中的數據進行驗證
  oldPwd: Joi.string().pattern(new RegExp('^[\\S]{6,12}$')).required(), //舊密碼要符合密碼規則
  newPwd: Joi.invalid(Joi.ref('oldPwd')).concat(Joi.string().pattern(new RegExp('^[\\S]{6,12}$')).required()) //新密碼要符合密碼規則，且不能等於舊密碼
  // repeat_password: Joi.ref('password')表示repeat_password要和password一模一樣。
  // location: Joi.invalid('qaz')表示location不能等於'qaz'這個字符串。
  // newPwd:Joi.invalid(Joi.ref('oldPwd'))表示新密碼不能和舊密碼一模一樣。
  // concat後面的是密碼的規則
  // concat把前後兩個特性連接起來
})

// 更新用戶頭像校驗規則
exports.update_avatar_schema = Joi.object({
  avatar: Joi.string().dataUri().required(),
})
