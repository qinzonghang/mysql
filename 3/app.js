var express = require('express');
var ejs = require('ejs');
var mysql = require('mysql');
var urlparser = express.urlencoded({ extended: false });
var app = express();
//创建数据库连接池
var pool = mysql.createPool({
    user: 'root',
    database: '1605b'
});
// app.use(express.static('./static/update.html'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
//渲染用户详情页
app.get('/user', function(req, res) {
    //从连接池中取出连接对象
    pool.getConnection(function(err, con) {
        if (err) {
            return res.json({ code: 2, msg: 'error' });
        }
        //使用连接对象操作数据表
        con.query('select * from user', function(err, result) {
            if (err) {
                return res.json({ code: 2, msg: 'error' });
            }
            res.locals.data = result;
            res.render('user');
            //释放连接对象
            con.release();
        });
    });
});
//删除用户信息
app.get('/api/delete', function(req, res) {
    pool.getConnection(function(err, con) {
        if (err) {
            return res.json({ code: 2, msg: 'error' });
        }
        con.query('delete from user where id=?', [req.query.id], function(err, result) {
            if (err) {
                return res.json({ code: 2, msg: 'error' });
            }
            res.json({ code: 0, msg: '删除成功' });
            con.release();
        });
    });
});
app.get('/update', function(req, res) {
    res.locals.query = req.query;
    res.render('update');
});
//修改信息
app.post('/api/update', urlparser, function(req, res) {
    pool.getConnection(function(err, con) {
        if (err) {
            return res.json({ code: 2, msg: 'error' });
        }
        con.query('update user set user=?,pwd=? where id=?', [req.body.user, req.body.pwd, req.body.id], function(err, result) {
            if (err) {
                return res.json({ code: 2, msg: 'error' });
            }
            res.json({ code: 0, msg: '修改成功' });
            con.release();
        });
    });
});
app.listen(8888, function() {
    console.log(8888);
});