/**
 *根据新闻ID返回新闻详情
 *请求参数：
 nid-新闻ID，必需
 *输出结果：
 {
   "nid": 1,
   ...
 }
 **/
const pool=require('../pool');
const express=require('express');
const router=express.Router();

module.exports=router;

router.post('/details',(req,res)=>{//详情
    let nid=req.body.nid;
    // console.log(nid);
    let sql='select * from news_details where nid=?';
    pool.query(sql, [nid],(err,rezult)=>{
        if (err)throw err;
        // console.log(rezult[0]);
        sql='select MAX(nid) as nid,title from news_details where nid<?';//找出比单前nid小的最大nid是上一个
        pool.query(sql, [nid],(err,rezultprevious)=>{
            if (err)throw err;
            // console.log(rezultprevious[0]);
            sql='select MIN(nid) as nid,title from news_details where nid>?';//找出比单前nid大的最小nid是上下个
            pool.query(sql, [nid],(err,rezultnext)=>{
                if (err)throw err;
                // console.log(rezultnext[0]);
                res.json({previous:rezultprevious[0],current:rezult[0],next:rezultnext[0]})
            })
        })
    })
});

router.post('/list',(req,res)=>{
    let sql='select * from news_details limit ? offset ?';
    pool.query(sql, [3,0],(err,rezult)=>{
        if (err)throw err
        // console.log(rezult);
        res.json(rezult)
    })
})


// router.post('/list',(req,res)=>{//列表
//     let nom=parseInt(req.body.nom);//获取当前页
//     let pageSize=5;//默认页面大小
//     let sql='select * from mf_news';//查询总行数
//     pool.query(sql,(err,rezult)=>{
//         if (err)throw err;
//         let length= rezult.length;//总行
//         sql = 'select * from mf_news limit ? offset ?';//查询当前页
//         pool.query(sql, [pageSize,nom*pageSize],(err,rezult)=>{
//             if (err)throw err;
//             let arr={page:{pageSize:pageSize,nom:nom, totalPage:Math.ceil(length/pageSize),totalCount:length},data:rezult};//返回分页详情，和当前页数据
//             res.json(arr);
//         })
//     })
// });



