// 導入數據庫操作模塊
const db = require('../db/index')
// 導入bcryptjs包
const bcrypt = require('bcryptjs')

// 導入需要的驗證規則對象
const { reg_login_schema } = require('../schema/user')

// 導入生成Token字符串的包
const jwt = require('jsonwebtoken')
// 導入全局的配置文件,以便拿到加密和解密token的秘鑰
const config = require('../config')

// 注册用户的处理函数
exports.regUser = (req, res) => {
  const userinfo = req.body
  // console.log(userinfo);
  // 對表單中的數據進行合法性校驗
  // if (!userinfo.username || !userinfo.password) {
  //   // return res.send({ status: 1, message: '用戶名或密碼不合規則TT' })  //注釋掉這段代碼，改用封裝好的中間件res.cc
  //   return res.cc('用戶名或密碼不合規則TT')
  // }

  // 用joi來驗證表單數據是否合規則
  const { error, value } = reg_login_schema.validate({ username: userinfo.username, password: userinfo.password })
  // console.log(error, value);
  // console.log(error.details[0].message)
  if (error) {
    return res.cc(error.details[0].message)
  }


  //定義SQL語句，查詢用戶名是否被佔用
  const sqlStr = 'select * from ev_users where username=?'
  db.query(sqlStr, userinfo.username, (err, results) => {
    // 執行SQL語句失敗
    if (err) {
      // return res.send({ status: 1, message: err.message })//注釋掉這段代碼，改用封裝好的中間件res.cc
      return res.cc(err)
    }
    // 判斷用戶名是否被佔用
    if (results.length > 0) {
      // return res.send({ status: 1, message: '用戶名被佔用TT，請嘗試其它用戶名' }) //注釋掉這段代碼，改用封裝好的中間件res.cc
      return res.cc('用戶名被佔用TT，請嘗試其它用戶名')
    }
    // 調用bcrypt.hashSync()對密碼加密
    // console.log(userinfo);
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    // console.log(userinfo);

    // 定義插入用戶的SQL語句：
    const sql = 'insert into ev_users set ?'
    // 調用db.query()執行SQL語句，插入新用戶：
    db.query(sql, { username: userinfo.username, password: userinfo.password }, function (err, results) {
      // 執行SQL語句失敗
      if (err) {
        // return res.send({ status: 1, message: err.message })//注釋掉這段代碼，改用封裝好的中間件res.cc
        return res.cc(err)
      }
      // SQL語句執行成功，但影響行數不為1
      if (results.affectedRows !== 1) {
        // return res.send({ status: 1, message: '註冊用戶失敗TT，請稍後再試' })//注釋掉這段代碼，改用封裝好的中間件res.cc
        return res.cc('註冊用戶失敗TT，請稍後再試')
      }
      // 註冊成功
      // res.send({ status: 0, message: '註冊成功！' }) //注釋掉這段代碼，改用封裝好的中間件res.cc
      res.cc('註冊成功！', 0)
    })
  })
  // res.send('reguser OK')
}

// 登录的处理函数
exports.login = (req, res) => {
  const userinfo = req.body

  // 用joi來驗證表單數據是否符合規則
  const { error, value } = reg_login_schema.validate({ username: userinfo.username, password: userinfo.password })
  if (error) {
    return res.cc(error.details[0].message)
  }

  // 定義SQL語句
  const sql = 'select * from ev_users where username=?'
  // 執行SQL語句，查詢用戶的數據：
  db.query(sql, userinfo.username, function (err, results) {
    // 執行SQL語句失敗
    if (err) return res.cc(err)
    // 執行SQL語句成功，但是查詢到數據條數不等於1
    if (results.length !== 1) return res.cc('登錄失敗TT')

    // 判斷密碼是否正確
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    if (!compareResult) return res.cc('登錄失敗！')

    // 在服務器端生成Token字符串
    const user = { ...results[0], password: '', user_pic: '' }
    // 第1個參數是待加密的數據，第2個參數是秘鑰，第3個參數中的1個鍵值對表示token的有效期
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn
    })
    res.send({
      status: 0,
      message: '登錄成功！',
      // 為了方便客戶端使用Token，在服務器端直接拼接上Bearer空格這個前綴
      token: 'Bearer ' + tokenStr,
    })
  })
}
