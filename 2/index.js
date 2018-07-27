//下载+引入模块
var mysql = require('mysql');
var express = require('express');
var ejs = require('ejs');
var path = require('path');
var app = express();
app.engine('html', ejs.readerFile);
app.set('view engine', 'html');
//与数据库建立连接
var pool = mysql.createPool({
    port: '3306',
    user: 'root',
    database: '1605b',
});
//请求根目录返回注册页
app.get('/', function(req, res) {
    res.render(path.resolve('views/register.html'));
});

//返回注册页
app.get('/register', function(req, res) {
    pool.getConnection(function(err, con) {
        if (err) {
            return res.json({ code: 1, msg: 'server error' });
        }
        var selectSql = 'select * from user where name=? and pwd=?';
        con.query(selectSql, [req.query.name, req.query.pwd], function(err, result) {
            if (err) {
                return res.json({ code: 1, msg: 'server error' });
            }
            if (result.length > 0) {
                return res.json({ code: 2, msg: '用户名被占用' });
            }
            var inserSql = 'insert into user(name,pwd) values(?,?)';
            con.query(inserSql, [req.query.name, req.query.pwd], function(err, result) {
                if (err) {
                    return res.json({ code: 1, msg: 'server error' });
                }
                res.json({ code: 0, msg: 'success' });
            });
        });
    });
});
app.listen(8800)