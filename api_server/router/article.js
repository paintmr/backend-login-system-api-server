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

// 發佈新文章的路由
router.post('/add', upload.single('cover_img'), article_handler.addArticle)

// 向外共享路由對象
module.exports = router