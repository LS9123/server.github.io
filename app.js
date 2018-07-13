const express = require('express')
const mysql = require('mysql');
const path = require('path');
const tem = require('art-template')
const multiparty = require('multiparty')
let app = express();
app.use(express.static('www'));
let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'test'
});
connection.connect();
// 获取首页
app.get('/index',  (req, res)=> {
    let content = req.query.search;
    let sql =content?`select * from manyhero where name like '%${content}%' order by id desc` :'select * from manyhero order by id desc';
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        // console.log('The results is: ', results);
        let html = tem(path.join(__dirname,'tem/index.art'),{
            results,
            content
        })    
        res.send( html )
    });
})
//get请求 删除
app.get( '/delete' ,  (req, res)=> {
    let sql =`delete from manyhero where id = ${req.query.id}`
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;    
        res.redirect( '/index' )
    });
})
//post请求 添加
app.post( '/add' , (req, res) =>{
    let form = new multiparty.Form({
        uploadDir: path.join(__dirname,'www/img')
    })
    form.parse(req, function(err, fields, files) {
        let sql = `insert into manyhero(name,icon) values ('${fields.name[0]}','img/${path.basename(files.icon[0].path)}')`
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            console.log('The results is: ', results);
            res.redirect( '/index' )
        });
        // connection.end();
      });
})
//get请求 更新1
app.get( '/update' ,  (req, res)=> {
    let sql =`select * from manyhero where id = ${req.query.id}` ;
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        console.log('The results is: ', results);
        let html = tem(path.join(__dirname,'tem/update.art'),{
            results,
        })    
        res.send( html )
    });
})
//post请求
app.post( '/update' , (req, res) =>{
    let form = new multiparty.Form({
        uploadDir: path.join(__dirname,'www/img')
    })
    form.parse(req, function(err, fields, files) {
        let sql = `update manyhero set name = '${fields.name[0]}'  , icon ='img/${path.basename(files.icon[0].path)}' where id =${fields.id[0]}`;
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            console.log('The results is: ', results);
            res.redirect( '/index' )
        });

      });
})
app.listen(3000,'127.0.0.1',()=>{console.log('success')})
