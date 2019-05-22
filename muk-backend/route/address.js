const pool=require('../pool');
const express=require('express');
let router=express.Router();
module.exports=router

router.post('/add',(req,res)=>{
    console.log(req.body);
    let uid= req.body.uid;
    let name= req.body.name;
    let phone= req.body.phone;
    let shen= req.body.shen;
    let shi= req.body.shi;
    let qu= req.body.qu;
    let address= req.body.address;
    let tel= req.body.tel;
    let mail= req.body.mail;
    let sql='INSERT INTO `muk_address`(`aid`, `uid`, `name`, `phone`, `shen`, `shi`, `qu`, `address`, `tel`, `mail`) VALUES (?,?,?,?,?,?,?,?,?,?)'
    pool.query(sql, [null,uid,name,phone,shen,shi,qu,address,tel,mail,sql,],(err,rezult)=>{
        // console.log(rezult);
        res.json({code:'ok',mesg:'地址添加成功',aid:rezult.insertId})
    })

})

router.post('/list',(req,res)=>{
    // console.log(req.body);
    let uid= req.body.uid;
    let sql='SELECT * FROM `muk_address` WHERE uid=? order by aid'
    pool.query(sql, [uid],(err,rezult)=>{
        // console.log(rezult);
        res.json(rezult)
    })
})

router.post('/change',(req,res)=>{
    let aid= req.body.aid;
    let name= req.body.name;
    let phone= req.body.phone;
    let shen= req.body.shen;
    let shi= req.body.shi;
    let qu= req.body.qu;
    let address= req.body.address;
    let tel= req.body.tel;
    let mail= req.body.mail;
    // console.log(req.body);
    let sql='UPDATE `muk_address` SET `name`=?,`phone`=?,`shen`=?,`shi`=?,`qu`=?,`address`=?,`tel`=?,`mail`=? WHERE aid=?'
    pool.query(sql, [name,phone,shen,shi,qu,address,tel,mail,aid],(err,rezult)=>{
        if (err)throw err
        // console.log(rezult);
        res.json(rezult)
    })
})

router.post('/del',(req,res)=>{
    let aid= req.body.aid;
    // console.log(req.body);
    let sql='DELETE FROM `muk_address` WHERE aid=?'
    pool.query(sql, [aid],(err,rezult)=>{
        if (err)throw err
        // console.log(rezult);
        res.json(rezult)
    })
})