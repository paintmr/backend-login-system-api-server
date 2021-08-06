// 導入數據庫操作模塊
const db = require('../db/index')

// 導入需要的驗證規則對象
const { add_cate_schema, cate_id_schema } = require('../schema/artcate')

// 獲取文字分類列表的處理函數
exports.getArticleCates = (req, res) => {
  // 定義SQL語句
  // 根據分類的狀態，獲取所有未被刪除的分類列表數據
  // is_delete為0表示沒有被標記為刪除的數據
  const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
  // 調用db.query()執行SQL語句
  db.query(sql, (err, results) => {
    // 如果執行SQL語句失敗
    if (err) return res.cc(err)
    // 如果執行SQL語句成功
    res.send({
      status: 0,
      message: '獲取文章分類列表成功！',
      data: results,
    })
  })
}

// 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
  const userinfo = req.body

  // 用joi來驗證表單數據是否符合規則
  const { error, value } = add_cate_schema.validate({ name: userinfo.name, alias: userinfo.alias })
  if (error) {
    return res.cc(error.details[0].message)
  }

  // 查詢分類名稱與別名是否被佔用
  // 定義查重的SQL語句
  const sql = 'select * from ev_article_cate where name=? or alias=?'
  // 調用db.query()執行查重的操作
  db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    // 如果執行SQL語句失敗
    if (err) return res.cc(err)
    // 判斷分類名稱和分類別名是否被佔用
    if (results.length === 2) return res.cc('分類名稱與別名各自被佔用，請更換後重試！')
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分類名稱被佔用，請更換後重試！')
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分類別名被佔用，請跟換後重試！')

    // 實現新增文章分類的功能
    // 定義新增文章分類的SQL語句
    const sql = 'insert into ev_article_cate set ?'
    // 調用db.query()執行新增文章分類的SQL語句：
    db.query(sql, req.body, (err, results) => {
      // 如果SQL 語句執行失敗
      if (err) return res.cc(err)
      // 如果SQL語句執行成功，但是影響行數不等於1
      if (results.affectedRows !== 1) return res.cc('新增文章分類失敗！')
      // 新增文章分類成功
      res.send({
        status: 0,
        message: '新增文章分類成功！',
      })
    })
  })
}

// 根據id刪除文章分類的處理函數
exports.deleteCateById = (req, res) => {
  // 用joi來驗證表單數據是否符合規則
  const { error, value } = cate_id_schema.validate({ id: req.params.id })
  if (error) {
    return res.cc(error.details[0].message)
  }

  // 實現刪除文章分類的功能
  // 定義刪除文章分類的SQL語句
  const sql = 'update ev_article_cate set is_delete=1 where id=?'
  // 調用db.query()執行刪除文章分類的SQL語句
  db.query(sql, req.params.id, (err, results) => {
    // 如果執行SQL語句失敗
    if (err) return res.cc(err)
    // 如果SQL語句執行成功，但是影響行數不等於1
    if (results.affectedRows !== 1) return res.cc('刪除文章分類失敗TT')
    // 刪除文章分類成功
    res.send({
      status: 0,
      message: '成功刪除文章分類！'
    })
  })
}

// 根據id獲取文章分類的處理函數
exports.getArticleById = (req, res) => {
  // 用joi來驗證表單數據是否符合規則
  const { error, value } = cate_id_schema.validate({ id: req.params.id })
  if (error) {
    return res.cc(error.details[0].message)
  }

  // 實現獲取文章分類的功能
  // 定義根據id獲取文章分類的SQL語句
  const sql = 'select * from ev_article_cate where is_delete=0 and id=?'
  // 調用db.query()執行SQL語句：
  db.query(sql, req.params.id, (err, results) => {
    // 如果執行SQL語句失敗
    if (err) return res.cc(err)
    // 如果SQL語句執行成功，但是沒有查詢到任何數據
    if (results.length !== 1) return res.cc('獲取文章分類數據失敗！')
    // 獲取數據成功，把數據響應給客戶端
    res.send({
      status: 0,
      message: '獲取文章分類數據成功！',
      data: results[0]
    })
  })
}