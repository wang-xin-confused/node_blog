// 通过stream的方式写日志
const fs = require('fs')
const path = require('path')

// 生成 write Stream
function createWriteStream(fileName) {
    const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName)
    const writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a'
    })
    return writeStream
}

// 写访问日志
const accessWriteStream = createWriteStream('access.log')

// 写日志 可以通过判断环境 dev环境就console出来  prod环境就写入文件中
function writeLog(writeStream, log) {
    writeStream.write(log + '\n')  // 关键代码
}

// 暴露给外面的方法
function access(log) {
    writeLog(accessWriteStream, log)
}

module.exports = {
    access
}