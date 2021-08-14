// 導入需要的驗證規則對象
const { add_article_schema, article_id_schema, update_article_schema } = require('../schema/article')
// 導入處理路徑的path核心模塊
const path = require('path')
// 導入數據庫操作模塊
const db = require('../db/index')

// 獲取文章列表的處理函數——获取展示的那一部分
exports.getArticlesShow = (req, res) => {
  // 獲取文章列表數據
  // 定義SQL語句
  // 根據文章的狀態，獲取所有未被刪除的文章數據
  // is_delete為0表示沒有被標記為刪除的數據
  // 如果用户选择了根据文章类别显示文章列表，则根据文章类别的id（cate_id）来筛选，否则不设置这个条件
  let cate_id = req.query.cate_id ? ' and cate_id = ' + req.query.cate_id : ' '
  let state = req.query.state ? ' and state = ' + '"' + req.query.state + '"' : ' '
  // 如果用户选择了根据文章的状态（已发布or草稿）显示文章列表,则根据文章状态（state）来筛选，否则不设置这个条件
  const sql = 'select * from ev_articles where is_delete=0' + cate_id + state + ' order by id asc limit ' + (req.query.pagenum - 1) * req.query.pagesize + ' , ' + req.query.pagesize
  // 調用db.query()執行SQL語句
  db.query(sql, (err, results) => {
    // 執行SQL語句失敗
    if (err) return res.cc(err)

    // 執行SQL語句成功
    res.send({
      status: 0,
      message: '獲取文章列表成功！',
      data: results
    })

  })
}

// 獲取文章列表的處理函數——获取所有的文章数量
exports.getArticlesAll = (req, res) => {
  {
    // 獲取文章列表數據
    // 定義SQL語句
    // 根據文章的狀態，獲取所有未被刪除的文章數據
    // is_delete為0表示沒有被標記為刪除的數據
    let cate_id = req.query.cate_id ? ' and cate_id = ' + req.query.cate_id : ' '
    let state = req.query.state ? ' and state = ' + '"' + req.query.state + '"' : ' '

    const sql = 'select * from ev_articles where is_delete=0 ' + cate_id + state + ' order by id asc'
    // 調用db.query()執行SQL語句
    db.query(sql, (err, results) => {
      // 執行SQL語句失敗
      if (err) return res.cc(err)

      // 執行SQL語句成功
      res.send({
        status: 0,
        message: '獲取文章列表成功！',
        data: results.length
      })

    })
  }
}

// 發佈新文章的處理函數
exports.addArticle = (req, res) => {
  // console.log(req.body)
  // console.log(req.file)
  // res.send('add')
  // return
  // 用joi來驗證表單數據是否符合規則
  const { error, value } = add_article_schema.validate({ title: req.body.title, cate_id: req.body.cate_id, content: req.body.content, state: req.body.state })
  if (error) {
    return res.cc(error.details[0].message)
  }
  // 判斷是否上傳了文章封面
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必選項')

  // 實現發佈文章的功能
  // 整理要插入數據庫的文章信息對象
  let articleInfo = {
    // 標題、內容、狀態、所屬的分類Id
    ...req.body,
    // 文章封面在服務器端的存放路徑
    cover_img: path.join('/uploads', req.file.filename),
    // 文章發佈時間
    pub_date: new Date(),
    // 文章作者的Id
    author_id: req.user.id,
  }
  // 如果articleInfo中有空的Id（发布文章时发送来的数据），则把这个属性去掉。以便写入数据库时系统自动填写。否则Id=''报错。
  if (!articleInfo.Id) {
    const { Id: Id, ...restData } = articleInfo
    articleInfo = restData
  }

  // 定義發佈文章的SQL語句
  const sql = 'insert into ev_articles set ?'
  // 調用db.query()執行發佈文章的SQL語句
  // 執行SQL語句
  db.query(sql, articleInfo, (err, results) => {
    // 如果執行SQL語句失敗
    if (err) return res.cc(err)
    // 如果執行SQL語句成功，但是影響行數不等於1 
    if (results.affectedRows !== 1) return res.cc('發佈文章失敗TT')
    // 發佈文章成功
    res.send({
      status: 0,
      message: '成功發佈文章！'
    })
  })
}

// 根據ID獲得文章詳情的處理函數
exports.getArticleById = (req, res) => {
  // 用joi來驗證表單數據是否符合規則
  const { error, value } = article_id_schema.validate({ id: req.params.id })
  if (error) {
    return res.cc(error.details[0].message)
  }

  // 實現獲取文章分類的功能
  // 定義根據Id獲取文章分類的SQL語句
  const sql = 'select * from ev_articles where id=? and is_delete=0'
  // 調用db.query()執行SQL語句
  db.query(sql, req.params.id, (err, results) => {
    // 如果執行SQL語句失敗
    if (err) return res.cc(err)
    // 如果SQL語句執行成功，但是沒有查詢到任何數據
    if (results.length !== 1) return res.cc('獲取文章詳情失敗！')
    // 把數據響應給客戶端
    res.send({
      status: 0,
      message: '獲取文章詳情成功！',
      data: results[0]
    })
  })
}

// 根據Id更新文章詳情的處理函數
exports.updateArticle = (req, res) => {
  // console.log(req.body)
  // console.log(req.file)
  // res.send('update')
  // return
  // 用joi來驗證表單數據是否符合規則
  const { error, value } = update_article_schema.validate({ id: req.body.Id, title: req.body.title, content: req.body.content, state: req.body.state, cate_id: req.body.cate_id })
  if (error) {
    return res.cc(error.details[0].message)
  }
  // 判斷是否上傳了文章封面
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必選項')

  // 實現發佈文章的功能
  // 整理要插入數據庫的文章信息對象
  const articleInfo = {
    // 標題、內容、狀態、所屬的分類Id
    ...req.body,
    // 文章封面在服務器端的存放路徑
    cover_img: path.join('/uploads', req.file.filename),
    // 文章發佈時間
    pub_date: new Date(),
  }
  // 定義更新文章的SQL語句
  const sql = 'update ev_articles set? where Id=? and is_delete=0'
  // 調用db.query()執行SQL語句
  db.query(sql, [articleInfo, req.body.Id], (err, results) => {
    // 如果執行SQL語句失敗
    if (err) return res.cc(err)
    // 如果SQL語句執行成功，但是影響行數不等於1
    if (results.affectedRows !== 1) return res.cc('更新文章詳情失敗TT')
    // 如果更新文章詳情成功
    res.send({
      status: 0,
      message: '更新文章詳情成功！',
    })
  })
}

// 根據ID刪除文章的處理函數
exports.deleteArticleById = (req, res) => {
  // 用joi來驗證表單數據是否符合規則
  const { error, value } = article_id_schema.validate({ id: req.params.id })
  if (error) {
    return res.cc(error.details[0].message)
  }

  // 實現刪除文章的功能
  const sql = 'update ev_articles set is_delete=1 where id=?'
  // 調用db.query()執行刪除文章分類的SQL語句
  db.query(sql, req.params.id, (err, results) => {
    // 如果執行SQL語句失敗
    if (err) return res.cc(err)
    // 如果SQL語句執行成功，但是影響行數不等於1
    if (results.affectedRows !== 1) return res.cc('刪除文章失敗！')
    // 刪除文章成功
    res.send({
      status: 0,
      message: '成功刪除文章！'
    })
  })
}