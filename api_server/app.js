// 导入express模块
const express = require('express')
// 创建express的服务器实例
const app = express()

// 导入cors中间件
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

// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 调用app.listen方法，指定端口号并启动web服务器
app.listen(3007, function () {
  console.log('api server running at http://127.0.0.1:3007')
})