const { exec } = require('../db/mysql')

const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`

    // 返回 promise
    return exec(sql)
}

const getDetail = (id) => {
    return [
        {
            id: '1',
            title: '2xxxx',
            content: '123123',
        },
        {
            id: '2',
            title: '2xxxx',
            content: '123123',
        }
    ]
}

const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象，包含 title content author 属性
    return {
        id: 3
    }
}
const updateBlog = (id, blogData = {}) => {
    return false
}
const delBlog = (id, author) => {
    return false
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}