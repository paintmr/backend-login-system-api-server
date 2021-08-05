// 导入数据库操作模块
const db = require('../db/index')
// 导入bcryptjs，驗證加密的密碼
const bcrypt = require('bcryptjs')

// 導入需要的驗證規則對象
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  // 定义SQL语句
  // 根据用户的id，查询用户的基本信息
  // 为了防止泄露用户密码，需要排除password字段
  const sql = 'select id, username, nickname, email, user_pic from ev_users where id=?'
  // 调用db.query()执行SQL语句
  // req对象上的user属性，是Token解析成功后，express-jwt中间件帮我们挂载上去的
  db.query(sql, req.user.id, (err, results) => {
    // 如果执行SQL语句失败
    if (err) return res.cc(err)
    // 如果执行SQL语句成功，但是查询到的数据条数不等于1
    if (results.length !== 1) return res.cc('获取用户信息失败！')
    // 将用户信息响应给客户端
    res.send({
      status: 0,
      message: '获取用户基本信息成功！',
      data: results[0]
    })
  })
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  const userinfo = req.body
  // 用joi來驗證表單數據是否符合規則
  const { error, value } = update_userinfo_schema.validate({ id: userinfo.id, nickname: userinfo.nickname, email: userinfo.email })
  if (error) {
    return res.cc(error.details[0].message)
  }

  // 定义待执行的SQL语句
  const sql = 'update ev_users set ? where id=?'
  db.query(sql, [req.body, req.body.id], (err, results) => {
    // 如果执行SQL语句失败
    if (err) return res.cc(err)
    // 如果执行SQL语句成功，但影响行数不为1
    if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败TT')
    // 如果修改用户信息成功
    res.send({
      status: 0,
      message: '修改用户基本信息成功！',
    })
  })
}

// 重置密码的处理函数
exports.updatedPassword = (req, res) => {
  const userinfo = req.body

  // 用joi來驗證表單數據是否符合規則
  const { error, value } = update_password_schema.validate({ oldPwd: userinfo.oldPwd, newPwd: userinfo.newPwd })
  if (error) {
    return res.cc(error.details[0].message)
  }

  // 定義 根據id查詢用戶數據 的SQL語句
  const sql = 'select * from ev_users where id=?'
  // 執行SQL語句查詢用戶是否存在
  db.query(sql, req.user.id, (err, results) => {
    // 執行SQL語句失敗
    if (err) return res.cc(err)
    // 檢查制定id的用戶是否存在
    if (results.length !== 1) return Reflect.cc('用戶不存在TT')

    // 判斷提交的舊密碼是否正確
    const compareResult = bcrypt.compareSync(userinfo.oldPwd, results[0].password)
    if (!compareResult) return res.cc('原密碼錯誤！')

    // 對新密碼進行bcrypt加密後，更新到數據庫中
    // 定義更新用戶密碼的SQL語句
    const sql = 'update ev_users set password=? where id=?'
    // 對新密碼進行bcrypt加密處理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    // 執行SQL語句，根據id更新用戶的密碼
    db.query(sql, [newPwd, req.user.id], (err, results) => {
      // 如果SQL語句執行直白
      if (err) return res.cc(err)
      // 如果SQL語句執行成功，但是影響行數不等於1
      if (results.affectedRows !== 1) return res.cc('更新密碼失敗TT')
      // 如果更新密碼成功
      res.send({
        status: 0,
        message: '修改密碼成功！',
      })
    })
  })
}

// 更新頭像的處理函數
exports.updateAvatar = (req, res) => {
  const userinfo = req.body

  // 用joi來驗證表單數據是否符合規則
  const { error, value } = update_avatar_schema.validate({ avatar: userinfo.avatar })
  if (error) {
    return res.cc(error.details[0].message)
  }

  // 定義更新用戶頭像的SQL語句
  const sql = 'update ev_users set user_pic=? where id=?'
  // 調用db.query()執行SQL語句，更新對應用戶的頭像
  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    // 如果執行SQL語句失敗
    if (err) return res.cc(err)
    // 如果執行SQL語句成功，但是影響行數不等於1
    if (results.affectedRows !== 1) return res.cc('更新頭像失敗TT')
    // 如果更新用戶頭像成功
    res.send({
      status: 0,
      message: '更新頭像成功！',
    })
  })
}