// const { exec } = require('../db/mysql')
const { exec, escape } = require('../db/mysql')
// 加密的方法
const { genPassword } = require('../utils/cryp')


const login = (username, password) => {

    // 凡是有spl语句拼接查询的地方都要使用escape包裹起变量 使用了这个之后spl中就不用自己拼接‘’了
    username = escape(username)
    // 生成加密过后的密码 去数据库中匹配 因为在注册成功的时候 数据库中存的就是加密过后的密码
    // password = genPassword(password)

    password = escape(password)

    // const sql = `
    //     select username, realname from users where username='${username}' and password='${password}'
    // `
    const sql = `
        select username, realname from users where username=${username} and password=${password}
    `
    console.log('sql is', sql)

    return exec(sql).then(rows => {
        // console.log(rows)
        return rows[0] || {}
    })
}

module.exports = {
    login
}