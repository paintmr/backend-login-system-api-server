const Joi = require('joi')

// 定義發佈文章的校驗規則
exports.add_article_schema = Joi.object({
  title: Joi.string().required(),
  cate_id: Joi.number().integer().min(1).required(),
  content: Joi.string().required().allow(''),
  state: Joi.string().valid('已發佈', '草稿').required()
})

// 定義文章id的校驗規則
exports.article_id_schema = Joi.object({
  id: Joi.number().integer().required()
})

// 根據id更新文章的校驗規則
exports.update_article_schema = Joi.object({
  id: Joi.number().integer().required(),
  title: Joi.string().required(),
  content: Joi.string().required().allow(''),
  state: Joi.string().valid('已發佈', '草稿').required(),
  cate_id: Joi.number().integer().min(1).required(),
})