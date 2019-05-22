/**
 *向购物车中添加商品
 *请求参数：
 uid-用户ID，必需
 pid-产品ID，必需
 *输出结果：
 * {"code":1,"msg":"succ", "productCount":1}
 * 或
 * {"code":400}
 */
const pool=require('../pool');
const express=require('express');
const qs=require('qs');
let router=express.Router();
module.exports=router

router.post('/list',(req,res)=>{
    //读取请求数据
    let uid=req.body.uid
    // console.log(uid);
    let sql='select * from muk_cart where uid= ? order by pid';
    pool.query(sql, [uid],(err,rezult)=>{
        if (err)throw err
        // console.log(rezult);
        if (rezult.length==0){
            res.json({code:'err',mesg:'购物车为空'})
        }else {
            let array=[]
            let j=0
            let length=rezult.length
            // console.log(length);
            for (let i=0;i<length;i++){
                let sql='select pid,show_img,title1,title2,select1,select2,select3,price1,price2,price3 from product_details where pid= ? order by pid';
                pool.query(sql, [rezult[i].pid],(err,rezult2)=>{
                    rezult2[0].selected=rezult[i].selected
                    rezult2[0].count=rezult[i].count
                    rezult2[0].total_prices=rezult[i].total_prices
                    rezult2[0].id=rezult[i].id
                    array.push(rezult2[0])
                    j++
                    if (j==length){
                        // console.log('res');
                        // console.log(array,'array');
                        res.json(array)
                    }
                })
            }
        }
    })
    //返回响应消息
    // let sql= 'SELECT * FROM muk_cart,product_details WHERE muk_cart.pid=product_details.pid'
    // let sql= 'SELECT * FROM muk_cart,muk_user WHERE muk_cart.uid=muk_user.uid'
});

router.post('/add',(req,res)=>{
    let uid=req.body.uid
    let pid=req.body.pid
    let selected=req.body.selected
    let count=req.body.count
    let total_prices=req.body.total_prices
    // console.log(uid,pid,selected,count,total_prices)
    let sql='select * from muk_cart where uid=? and pid=? and selected=? order by pid';
    pool.query(sql, [uid,pid,selected],(err,rezult)=>{
        if (err)throw err;
        if(rezult.length!=0){
            let id=rezult[0].id
            sql='UPDATE `muk_cart` SET `count`=?,`total_prices`=? WHERE uid=? and pid=? and selected=?';
            pool.query(sql, [count,total_prices,uid,pid,selected],(err,rezult)=>{
                res.json({code:1,mesg:"更新成功！",id:id})
            })
        }else {
            sql='INSERT INTO `muk_cart` VALUES (?,?,?,?,?,?)';
            pool.query(sql, [null,uid,pid,selected,count,total_prices],(err,rezult)=>{
                if (err)throw err
                // console.log(rezult.affectedRows);
                if (rezult.affectedRows==1){
                    console.log(rezult.insertId);
                    req.session.uid=req.body.uid;
                    res.json({code:1,mesg:"添加成功！",id:rezult.insertId})
                }
            })
        }
    })
})

router.post('/chang',(req,res)=>{
    console.log(req.body.id);
    console.log(req.body.count);
    console.log(req.body.total_prices);
    let id=req.body.id
    let count=req.body.count
    let total_prices=req.body.total_prices
    let sql='UPDATE `muk_cart` SET `count`=?,`total_prices`=? WHERE id=?';
    pool.query(sql, [count,total_prices,id],(err,rezult)=>{
        if(rezult.affectedRows==1){
            res.json({code:1,mesg:"更行成功！"})
        }
    })

})

router.post('/delete',(req,res)=>{
    let cid=req.body.cid
    let sql='DELETE FROM `muk_cart` WHERE id=?';
    pool.query(sql, [cid],(err,rezult)=>{
        if(rezult.affectedRows==1){
            res.json({code:1,mesg:"成功！"})
        }
    })

})

router.post('/purchase',(req,res)=>{
    let string=req.body.string
    let ids=string.split("::");
    // console.log(ids);
    let id=0
    // console.log(uid);
    let uid=ids[0].split(",,")[0].split("=")[1];
    let cost=ids[0].split(",,")[1].split("=")[1];
    let length=ids.length-1
    let j=0
    let sid=''
    for (let i=1;i<ids.length;i++){
        let timer=setTimeout(()=>{
            id = ids[i]
            // console.log(id);
            let sql='INSERT INTO muk_cart_selled ( id,uid,pid,selected,count,total_prices ) SELECT id,uid,pid,selected,count,total_prices  FROM muk_cart  WHERE id=?'
            pool.query(sql, [id],(err,rezult)=>{
                // console.log(rezult.affectedRows);
                // console.log(rezult.insertId);
                sid+=rezult.insertId+'::'
                sql ='DELETE FROM `muk_cart` WHERE id=?'
                pool.query(sql, [id],(err,rezult)=>{
                    j++
                    // console.log(j, length)
                    if (j==length){
                        sql ='INSERT INTO `muk_order`(`oid`, `uid`, `sid`, `total_cost`) VALUES (?,?,?,?)'
                        pool.query(sql, [null,uid,sid,cost],(err,rezult)=>{
                            res.json({code:1,mesg:"下单成功！",oid:rezult.insertId},)
                        })
                    }
                })
            })
        },(i+1)*30)
    }

    // ids.shift()
    // // console.log(id);
    // let sql='INSERT INTO muk_cart_selled ( id,uid,pid,selected,count,total_prices ) SELECT id,uid,pid,selected,count,total_prices  FROM muk_cart  WHERE id in(?,?,?)'
    //  pool.query(sql, [ids],(err,rezult)=>{
    //
    //  })
});

router.post('/carousel',(req,res)=>{
    sql='SELECT pid,show_img,title1,title2,select1,price1 FROM `product_details` order by pid LIMIT 4 OFFSET 0 ';
    pool.query(sql, [],(err,rezult)=>{
        // console.log(rezult);
        res.json(rezult)
    })
})
