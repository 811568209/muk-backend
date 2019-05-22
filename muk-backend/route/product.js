const pool=require('../pool');
const express=require('express');
const router=express.Router();

module.exports=router;

router.post('/details',(req,res)=>{
    let pid=req.body.pid
    console.log(req.body);
    let sql='select * from product_details where pid=?';
    pool.query(sql, [pid],(err,rezult)=>{
        if (err)throw err
        // console.log(rezult[0]);
        res.json(rezult[0])
    })
});

router.post('/list',(req,res)=>{
    let pageSize=parseInt(req.body.pageSize)
    let pageNeed=parseInt(req.body.pageNeed)
    let pageTotal=parseInt(req.body.pageTotal);
    let totalRow=0
    let sql='select * from product_details';
    pool.query(sql,(err,rezult)=>{
        if (err)throw err
        // console.log(rezult);
        totalRow=rezult.length
        pageTotal=Math.ceil(totalRow/pageSize)

        sql='select * from product_details order by pid limit ? offset ? ';
        pool.query(sql, [pageSize,pageSize*(pageNeed-1)],(err,rezult)=>{
            if (err)throw err
            // console.log(rezult);
            let data={data:rezult,pageData:{pageSize:pageSize,pageNeed:pageNeed,pageTotal:pageTotal,totalRow:totalRow}}
            res.json(data)
        })
    })


});

router.post('/carousel',(req,res)=>{
    let sql='select * from product_center_carousel';
    pool.query(sql, [ ],(err,rezult)=>{
        if (err)throw err
        // console.log(rezult);
        res.json(rezult)
    })
});

router.post('/referr',(req,res)=>{
    let sql='select * from product_center_referr';
    pool.query(sql, [ ],(err,rezult)=>{
        if (err)throw err
        // console.log(rezult);
        res.json(rezult)
    })
});

router.post('/search',(req,res)=>{
    let pageSize=parseInt(req.body.pageSize)
    let pageNeed=parseInt(req.body.pageNeed)
    let pageTotal=parseInt(req.body.pageTotal);
    let totalRow=0

    let search=req.body.search;
    let searcharr=search.split('')
    searcharr.unshift(search)
    let likearr=[]
    let searcharr2=[]
    for (let i=0;i<searcharr.length;i++){
        if (i ==0){
            searcharr2.push('%'+searcharr[i]+'%')
            likearr.push(' title2 like ? ')
        }else if (/^[\u4e00-\u9fa5]+$/.test(searcharr[i])){
            searcharr2.push('%'+searcharr[i]+'%')
            likearr.push(' title2 like ? ')
        }else if (!/^[\u4e00-\u9fa5]+$/.test(searcharr[i])){

        }
    }
    likearr=likearr.join('or');
    // for (let j=0;j<searcharr.length;j++) {
    //     searcharr[j]='%'+searcharr[j]+'%'
    // }
    console.log(searcharr2)
    console.log(likearr);
    let sql='select * from product_details where'+likearr
    pool.query(sql,searcharr2,(err,rezult)=>{
        if (err)throw err
        // console.log(rezult);
        // res.json(rezult)
        totalRow=rezult.length

        pageTotal=Math.ceil(totalRow/pageSize)
        searcharr2.push(pageSize)
        searcharr2.push(pageSize*(pageNeed-1))
        sql='select * from product_details where'+likearr+'order by pid limit ? offset ? ';
        pool.query(sql,searcharr2,(err,rezult)=>{
            if (err)throw err
            // console.log(rezult);
            let data={data:rezult,pageData:{pageSize:pageSize,pageNeed:pageNeed,pageTotal:pageTotal,totalRow:totalRow}}
            res.json(data)
        })
    })
})