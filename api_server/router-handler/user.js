// 導入數據庫操作模塊
const db = require('../db/index')
// 導入bcryptjs包
const bcrypt = require('bcryptjs')

// 注册用户的处理函数
exports.regUser = (req, res) => {
  const userinfo = req.body
  // console.log(userinfo);
  // 對表單中的數據進行合法性校驗
  if (!userinfo.username || !userinfo.password) {
    // return res.send({ status: 1, message: '用戶名或密碼不合規則TT' })  //注釋掉這段代碼，改用封裝好的中間件res.cc
    return res.cc('用戶名或密碼不合規則TT')
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
  res.send('login OK')
}
