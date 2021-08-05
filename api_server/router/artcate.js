// 導入express
const express = require('express')
// 創建路由對象
const router = express.Router()

// 导入文章分類路由处理函数模块
const artcate_Handler = require('../router-handler/artcate')


// 獲取文章分類的數據列表
router.get('/cates', artcate_Handler.getArticleCates)

// 向外共享路由對象
module.exports = router