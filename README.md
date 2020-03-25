### g push -u origin master 以后可以使用 git push 代替 没啥用 不同分支提交后面都是要对应的

### mysql 是硬盘数据库 redis 是内存数据库

# 项目启动

mySql
redis-server 启动 redis 服务 redis-cli 在控制台中使用 redis
nginx nginx -s stop nginx -s reopen 前后端联调
http-server -p 8001 启动前端页面静态资源

npm run dev
npm run build

// 线上环境中自定义日志与错误日志通过pm2可以进行配置

其中"error_file": "logs/err.log",
    "out_file": "logs/out.log",可以指定输出的位置

console.log(xxxx)是自定义日志

console.error()
throw new Error('xxxx') 程序报错就是错误日志了
