// 發佈新文章的處理函數
exports.addArticle = (req, res) => {
  console.log(req.body)
  console.log(req.file)
  res.send('發佈新文章')
}
