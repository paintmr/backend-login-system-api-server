const Joi = require('joi')

// 增加文章分類的校驗規則
exports.add_cate_schema = Joi.object({
  name: Joi.string().required(),
  alias: Joi.string().alphanum().required()  //string.alphanum() Requires the string value to only contain a-z, A-Z, and 0-9.
})

// 定義文章分類id的校驗規則
exports.cate_id_schema = Joi.object({
  id: Joi.number().integer().required()
})
