const handleBlogRouter = (req, res) => {
    const method = req.method // GET POST

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        return {
            msg: "这是博客列表"
        }
    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        return {
            msg: "这是博客详情"
        }
    }


    // 新建一篇博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        return {
            msg: "这是新建博客"
        }
    }

    // 更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        return {
            msg: "这是更新博客"
        }
    }

    // 删除一篇博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        return {
            msg: "这是删除博客"
        }
    }
}

module.exports = handleBlogRouter