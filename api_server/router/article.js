// 導入express
const express = require('express')
// 創建路由對象
const router = express.Router()

// 导入文章路由处理函数模块
const article_handler = require('../router-handler/article')

// 導入multer和path
const multer = require('multer')
const path = require('path')

// 創建multer實例
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 獲取文章列表的路由
router.get('/artlist', article_handler.getArticles)

// 發佈新文章的路由
router.post('/addart', upload.single('cover_img'), article_handler.addArticle)

// 根據id獲取文章詳情的路由
router.get('/:id', article_handler.getArticleById)

// 根據id更新文章信息的路由
router.post('/updateart', upload.single('cover_img'), article_handler.updateArticle)

// 根據id刪除文章數據的路由
router.get('/deleteart/:id', article_handler.deleteArticleById)

// 向外共享路由對象
module.exports = router