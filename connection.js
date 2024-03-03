

const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password: 'sqlmakri',
    database: 'bmf'

}).promise()

const results= await db.query("select  * from user")
console.log(results[0])