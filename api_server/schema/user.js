const Joi = require('joi')

/**
* string() 值必須是字符串
* alphanum() 值只能是包含 a-zA-Z0-9 的字符串
* min(length) 最小長度
* max(length) 最大長度
* required() 值是必填項，不能為 undefined
* pattern(正則表達式) 值必須符合正則表達式的規則
*/

// 註冊和登錄表單的驗證規則對象
exports.reg_login_schema = Joi.object({
  // 表示需要對req.body中的數據進行驗證
  username: Joi.string().alphanum().min(3).max(10).required(),
  // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
  password: Joi.string().pattern(new RegExp('^[\\S]{6,12}$')).required()
})

