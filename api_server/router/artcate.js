// 導入express
const express = require('express')
// 創建路由對象
const router = express.Router()

// 导入文章分類路由处理函数模块
const artcate_handler = require('../router-handler/artcate')


// 獲取文章分類的數據列表
router.get('/cates', artcate_handler.getArticleCates)

// 新增文章分类的路由
router.post('/addcates', artcate_handler.addArticleCates)

// 根據id刪除文章分類的路由
router.get('/deletecate/:id', artcate_handler.deleteCateById)

// 根據id獲取文章分類的路由
router.get('/cate/:id', artcate_handler.getArticleById)

// 向外共享路由對象
module.exports = router