const getList = (author, keyword) => {
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