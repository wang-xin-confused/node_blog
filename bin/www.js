// 第一层 只负责端口  创建服务
const http = require('http')

const PORT = 8000
const serverHandle = require('../app')

const server = http.createServer(serverHandle) // 接收一个函数 包含req,res两个参数
server.listen(PORT)