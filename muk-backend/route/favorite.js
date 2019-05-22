const pool=require('../pool');
const express=require('express');
let router=express.Router();
module.exports=router

router.post('/',(req,res)=>{
    let uid=req.body.uid;
    let pid=req.body.pid;
    let selected=req.body.selected;
    // console.log(selected,'sele');
    let sql='SELECT * FROM `muk_favorite` WHERE uid=? and pid=? and selected=?'
    pool.query(sql, [uid,pid,selected],(err,rezult)=>{
        if (err)throw err
        // console.log(rezult);
        if (rezult.length==0){
            res.json({favorite:false})
        }else{
            res.json({favorite:true})
        }
    })
})

router.post('/collect',(req,res)=>{
    let uid=req.body.uid
    let pid=req.body.pid
    let selected=req.body.selected;
    let sql='SELECT * FROM `muk_favorite` WHERE uid=? and pid=? and selected=?'
    pool.query(sql, [uid,pid,selected],(err,rezult)=>{
        if (err)throw err
        if (rezult.length==0){
            sql='INSERT INTO `muk_favorite` VALUES (?,?,?,?)'
            pool.query(sql, [null,uid,pid,selected],(err,rezult2)=>{
                // console.log(rezult2.insertId);
                res.json({favorite:true,insertId:rezult2.insertId})
            })
        }else{
            let fid=rezult[0].fid
            sql='DELETE FROM `muk_favorite` WHERE fid=?'
            pool.query(sql, [fid],(err,rezult)=>{
                if (rezult.affectedRows==1){
                    res.json({favorite:false,affectedRows:rezult.affectedRows})
                }
            })
        }
    })
})

router.post('/list',(req,res)=>{
    let uid=req.body.uid
    let sql='SELECT * FROM muk_favorite INNER JOIN product_details on muk_favorite.pid=product_details.pid WHERE muk_favorite.uid=? order by fid'
    pool.query(sql, [uid],(err,rezult)=>{
        // console.log(rezult);
        res.json(rezult)
    })
})

router.post('/cancel',(req,res)=>{
    let fid=req.body.fid
    sql='DELETE FROM `muk_favorite` WHERE fid=?'
    pool.query(sql, [fid],(err,rezult)=>{
        if (rezult.affectedRows==1){
            res.json({favorite:false,affectedRows:rezult.affectedRows})
        }
    })
})