const pool=require('../pool');
const express=require('express');
let router=express.Router();
module.exports=router

router.post('/carousel',(req,res)=>{
    let sql='select * from index_carousel';
    pool.query(sql, [ ],(err,rezult)=>{
        if (err)throw err
        // console.log(rezult);
        res.json(rezult)
    })
});

router.post('/referr',(req,res)=>{
    let sql='select * from index_referr';
    pool.query(sql, [ ],(err,rezult)=>{
        if (err)throw err
        // console.log(rezult);
        res.json(rezult)
    })
});

router.post('/hot',(req,res)=>{
    let sql='select * from index_hot';
    pool.query(sql, [ ],(err,rezult)=>{
        if (err)throw err
        // console.log(rezult);
        res.json(rezult)
    })
});
