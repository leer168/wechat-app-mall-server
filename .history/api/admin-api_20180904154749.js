const moment = require('moment')
const mongoose = require('../mongoose')
const Category = mongoose.model('Category')
const Article = mongoose.model('Article')
/**
 * 添加分类
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */

exports.addClass = (req, res) => {
    const { cate_name, cate_order } = req.body
    if (!cate_name || !cate_order) {
        res.json({
            code: -200,
            message: '请填写分类名称和排序'
        })
    } else {
        return Category.createAsync({
            cate_name,
            cate_order,
            creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            is_delete: 0,
            timestamp: moment().format('X')
        }).then(result => {
            res.json({
                code: 200,
                message: '添加成功',
                data: result._id
            })
        })
    }
}

/**
 * 添加列表
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.addItem = (req, res) => {
    const { 
      category,
      content, 
      title,
      img,
      spec,
      price,
      num
    } = req.body
  
    console.log(req.body)
    // const html = marked(content)
    const arr_category = category.split('|')
    console.log(arr_category[0])
    const data = {
        title,
        img,
        spec,
        price,
        num,
        category: arr_category[0],
        category_name: arr_category[1],
        content,
        html:content,
        visit: 0,
        like: 0,
        comment_count: 0,
        creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        is_delete: 0,
        timestamp: moment().format('X')
    }

    Article.createAsync(data)
      .then(result => {
          return Category.updateAsync({ _id: arr_category[0] }, { $inc: { cate_num: 1 } }).then(() => {
              return res.json({
                  code: 200,
                  message: '发布成功',
                  data: result
              })
          })
      })
      .catch(err => {
          res.json({
              code: -200,
              message: err.toString()
          })
      })
}