// 第二层 处理接收到请求  发送到各个路由文件中  不涉及业务逻辑代码
// 第三层 router文件中 处理响应路由的业务逻辑
// 第四层 controller层 处理数据层面的东西，不涉及业务逻辑
const querystring = require('querystring') // 原生模块
const { get, set } = require('./src/db/redis') // 读写redis的方法
const { access } = require('./src/utils/log') // access访问记录 自己写log

const handleBlogRouter = require('./src/router/blog') // 用于处理/blog的路由
const handleUserRouter = require('./src/router/user') // 用于处理/user的路由


// 获取 cookie 的过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000)) // 后一天
    console.log('d.toGMTString() is ', d.toGMTString())
    return d.toGMTString()
}
// console.log(123123) 每一个请求都会经过这里

// 用于处理 post data  return promise对象
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
    // 记录 access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

    //设置返回格式JSON
    res.setHeader('Content-type', 'application/json') // 设置返回内容的格式

    // 获取 path
    const url = req.url
    // console.log(url)  除了域名端口 后面的内容 /api/blog/xxxx?xxxx#xxx
    req.path = url.split('?')[0]  // 获取问好前面的内容

    // 解析 query 处理get请求的参数传递
    req.query = querystring.parse(url.split('?')[1]) // node原生模块 会生成一个对象

    // 解析 cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''  // k1=v1;k2=v2;k3=v3
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })// 将cookie信息分割开保存在对象中

    // // 解析 session //每个请求进入时都要经过这里 获取到对应userId对应的对象设置成request.session对象
    // let needSetCookie = false
    // let userId = req.cookie.userid
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }
    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    // 解析 session （使用 redis）
    let needSetCookie = false // 是否需要设置cookie 默认为false
    let userId = req.cookie.userid // 从cookie获取userId
    if (!userId) { // 没有userId的话 
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}` // 生成一个随机的userId
        // 初始化 redis 中的 session 值
        set(userId, {}) // 设置redis中对应userId的值是一个空对象 
    }
    //将userId设置给req.sessionId 字段    因为上面已经处理过没有值的情况了  这里肯定有值
    req.sessionId = userId
    // get方法获取redis的值
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, {})
            // 设置 session
            req.session = {} // session内容为空
        } else {
            // 设置 session内容为redis中保存的数据
            req.session = sessionData
        }
        console.log('req.sessionredis获取的用户信息', req.session)

        // 处理 post data
        return getPostData(req) // return promise
    }).then(postData => {
        req.body = postData // 将post请求的数据挂到body上
        // 处理 blog 路由
        // const blogData = handleBlogRouter(req, res)
        // if (blogData) {
        //     res.end(
        //         JSON.stringify(blogData)
        //     )
        //     return
        // }

        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                // 在cookie中没有userId的话 就需要重新设置cookie
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                // console.log(blogData)
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        // 处理user路由下的请求
        // const userData = handleUserRouter(req, res)
        // if (userData) {
        //     res.end(
        //         JSON.stringify(userData)
        //     )
        //     return
        // }
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }

                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }


        // 未命中路由，返回 404
        res.writeHead(404, { "Content-type": "text/plain" })
        res.write("404 Not Found\n")
        res.end()
    })

}

module.exports = serverHandle