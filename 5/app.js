var express = require('express');
var path = require('path');
var mysql = require('mysql');
var ejs = require('ejs');
var urlparser = express.urlencoded({ extended: false });
var app = express();
var pool = mysql.createPool({
    user: 'root',
    database: '1605b',
    connectionLimit: 200
});
app.use(express.static('./static'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
//模糊查询
app.get('/index', function(req, res) {
    res.sendFile(path.resolve('views/index.html'));
});
app.get('/api/index', function(req, res) {
    pool.getConnection(function(err, con) {
        if (err) {
            return res.json({ code: 1, msg: 'error' });
        }
        con.query('select * from user where user like "%' + req.query.val + '%"', function(err, result) {
            if (err) {
                return res.json({ code: 1, msg: 'error' });
            }
            if (result.length > 0) {
                return res.json({ code: 0, msg: result });
            }
            res.json({ code: 2, msg: '暂无用户' });
            con.release();
        })
    });
});
//分页查询
app.get('/page', function(req, res) {
    pool.getConnection(function(err, con) {
        if (err) {
            return res.json({ code: 1, msg: 'error' });
        }
        con.query('select * from user', function(err, result) {
            if (err) {
                return res.json({ code: 1, msg: 'error' });
            }
            var page = Math.ceil(result.length / 5);
            res.locals.user = result.slice(0, 5);
            res.locals.page = page;
            res.render('page');
        });
    });
});
app.post('/api/page', urlparser, function(req, res) {
    pool.getConnection(function(err, con) {
        if (err) {
            return res.json({ code: 1, msg: 'error' });
        }

        var idx = req.body.idx * 1;
        var limit = req.body.limit * 1;
        var start = (idx - 1) * limit;
        con.query('select * from user limit ?,?', [start, limit], function(err, result) {
            if (err) {
                return res.json({ code: 1, msg: 'error' });
            }
            res.json({ code: 0, msg: result });
            con.release();
        });
    });
});
app.listen(8080, function() {
    console.log(8080);
});