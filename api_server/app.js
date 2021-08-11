// 导入express模块
const express = require('express')
// 创建express的服务器实例
const app = express()

// 导入cors中间件，解决跨域的问题
const cors = require('cors')
app.use(cors())

// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 一定要在路由之前封裝res.cc函數
app.use((req, res, next) => {
  // status默認值為1，表示失敗的情況
  // err的值可能是一個錯誤對象，也可能是一個錯誤的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 在路由之前配置解析Token的中間件
const expressJWT = require('express-jwt')
// 導入配置文件
const config = require('./config')
// 解密配置文件中的秘鑰，並使用.uless()指定哪些接口無需token身份認證。要把圖片文件夾uploads寫進unless中，否則在編輯文章時，前端的img標籤無法拿到文章對應的封面圖片。
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//, /^\/uploads\//] }))
// 定義錯誤級別的中間件
app.use((err, req, res, next) => {
  // 身份認證失敗導致的錯誤
  if (err.name === 'UnauthorizedError') return res.cc('身份認證失敗TT')
  // 未知的錯誤
  res.cc(err)
  // next()
})

// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 以/my开头的接口，都是有权限的接口，需要进行Token身份认证
app.use('/my', userinfoRouter)

// 導入並使用文章分類路由模塊
const artCateRouter = require('./router/artcate')
app.use('/my/artcate', artCateRouter)

// 導入並使用文章路由模塊
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

// 託管靜態資源文件
app.use('/uploads', express.static('./uploads'))

// 调用app.listen方法，指定端口号并启动web服务器
app.listen(3007, function () {
  console.log('api server running at http://127.0.0.1:3007')
})