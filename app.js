// 第二层 处理接收到请求  发送到各个路由文件中  不涉及业务逻辑代码
// 第三层 router文件中 处理响应路由的业务逻辑
// 第四层 controller层 处理数据层面的东西，不涉及业务逻辑
const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 用于处理 post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}

const serverHandle = (req, res) => {
    //设置返回格式JSON
    res.setHeader('Content-type', 'application/json')

    // 获取 path
    const url = req.url
    req.path = url.split('?')[0]

    // 解析 query
    req.query = querystring.parse(url.split('?')[1])

    getPostData(req).then(postData => {
        req.body = postData
        // 处理blog路由下的请求
        const blogData = handleBlogRouter(req, res)
        if (blogData) {
            res.end(
                JSON.stringify(blogData)
            )
            return
        }
        // 处理user路由下的请求
        const userData = handleUserRouter(req, res)
        if (userData) {
            res.end(
                JSON.stringify(userData)
            )
            return
        }


        // 未命中路由，返回 404
        res.writeHead(404, { "Content-type": "text/plain" })
        res.write("404 Not Found\n")
        res.end()
    })

}

module.exports = serverHandle


// const resData = {
//     name: 'xxx',
//     site: 'xxxxx',
//     env: process.env.NODE_ENV
// }

// res.end(
//     JSON.stringify(resData)
// )
