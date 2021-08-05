// 導入數據庫操作模塊
const db = require('../db/index')

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
      message: '獲取文字分類列表成功！',
      data: results,
    })
  })
}