const pool=require('../pool');
const express=require('express');
let router=express.Router();
module.exports=router

router.post('/list/pd',(req,res)=>{
    let length='?'
    let pid=[]
    let pid1=req.body.pid;
    if(pid1.indexOf('::')==-1){
        pid.push(pid1)
        let sql='select pid,show_img,title1,title2,select1,select2,select3,price1,price2,price3 from product_details where pid in('+length+') order by pid';
        pool.query(sql,pid,(err,rezult)=>{
            res.json(rezult)
        })
    }
})
router.post('/list/ca',(req,res)=>{
    let length='?'
    let arr=[]
    let cid=[]
    let cid1=req.body.cid;
    if (cid1.indexOf('::')!=-1) {
        cid = cid1.split('::')
        for (let i = 1; i < cid.length; i++) {
            arr.push('?')
        }
        length = arr.join(',')
        sql='select * from muk_cart where uid=? and id in(' + length + ') order by id';
        pool.query(sql,cid,(err,rezult2)=>{
            if (err)throw err
            let pid=[]
            for (let elem of rezult2){
                if (pid.indexOf(elem.pid)==-1){
                    pid.push(elem.pid)
                }
            }
            let arr=[]
            for (let i = 0; i < pid.length; i++) {
                arr.push('?')
            }
            length = arr.join(',')
            let sql = 'select pid,show_img,title1,title2,select1,select2,select3,price1,price2,price3 from product_details where pid in(' + length + ') order by pid';
            pool.query(sql, pid, (err, rezult) => {
                for (let i=0;i<rezult2.length;i++){
                    for (let j=0;j<rezult.length;j++){
                        if (rezult2[i].pid == rezult[j].pid){
                            rezult2[i].show_img=rezult[j].show_img
                            rezult2[i].title1=rezult[j].title1
                            rezult2[i].title2=rezult[j].title2
                            rezult2[i].select1=rezult[j].select1
                            rezult2[i].select2=rezult[j].select2
                            rezult2[i].select3=rezult[j].select3
                            rezult2[i].price1=rezult[j].price1
                            rezult2[i].price2=rezult[j].price2
                            rezult2[i].price3=rezult[j].price3
                        }
                    }
                }
                res.json(rezult2)
            })
        })
    }
});

router.post('/purchase/ca',(req,res)=> {
    let uid=req.body.uid, cid=req.body.cid, cost=req.body.cost, node=req.body.node, aid=req.body.aid
    cid=cid.split('::');
    let arr=[];
    for (let elem of cid){
        arr.push('?')
    }
    let length='';
    length=arr.join(',');
    let sql = 'INSERT INTO muk_cart_selled ( id,uid,pid,selected,count,total_prices ) SELECT id,uid,pid,selected,count,total_prices  FROM muk_cart  WHERE id in('+length+')'
    pool.query(sql,cid, (err, rezult) => {
        let sid='';
        let sidarr=[];
        let insertId=rezult.insertId;
        for (let elem of cid){
            sidarr.push(insertId);
            insertId++
        }
        sid=sidarr.join("::");
        sql = 'DELETE FROM `muk_cart` WHERE id in('+length+')';
        pool.query(sql,cid, (err, rezult) => {
            let now=new Date();
            let month=(now.getMonth()+1).toString();
            if (now.getMonth()+1<10){
                month='0'+(now.getMonth()+1).toString()
            }
            let date=now.getDate().toString();
            if (now.getDate()<10){
                date='0'+now.getDate().toString()
            }
            let serial=now.getFullYear().toString()+month+date+now.getTime().toString();
            sql = 'INSERT INTO `muk_order`(`oid`, `uid`, `aid`, `sid`, `cost`, `serial`, `node` , `payYet`) VALUES (?,?,?,?,?,?,?,?)'
            pool.query(sql, [null, uid,aid,sid, cost,serial,node,'false'], (err, rezult) => {
                res.json({code: 1, mesg: "下单成功！", oid: rezult.insertId,affectedRows:rezult.affectedRows},)
            })
        })
    })
});

router.post('/purchase/pd',(req,res)=> {
    let uid=req.body.uid, pid=req.body.pid, cost=req.body.cost, node=req.body.node, aid=req.body.aid;
    let selected=req.body.selected, count=req.body.count, total_prices=req.body.total_prices;
    let sql = 'INSERT INTO `muk_cart_selled`(`sid`, `id`, `uid`, `pid`, `selected`, `count`, `total_prices`) VALUES (?,?,?,?,?,?,?)'
    pool.query(sql,[null,0,uid,pid,selected,count,total_prices], (err, rezult) => {
        let sid=rezult.insertId;
        let now=new Date()
        let month=(now.getMonth()+1).toString()
        if (now.getMonth()+1<10){
            month='0'+(now.getMonth()+1).toString()
        }
        let date=now.getDate().toString()
        if (now.getDate()<10){
            date='0'+now.getDate().toString()
        }
        let serial=now.getFullYear().toString()+month+date+now.getTime().toString()
        sql = 'INSERT INTO `muk_order`(`oid`, `uid`, `aid`, `sid`, `cost`, `serial`, `node`, `payYet`) VALUES (?,?,?,?,?,?,?,?)'
        pool.query(sql, [null, uid,aid,sid, cost,serial,node,'false'], (err, rezult) => {
            if (err)throw err
            res.json({code: 1, mesg: "下单成功！", oid: rezult.insertId,affectedRows:rezult.affectedRows})
        })
    })
})

router.post('/pay/oid',(req,res)=> {
    let oid=req.body.oid
    let sql='select * from `muk_order` WHERE oid=?';
    pool.query(sql, [oid], (err, rezult) => {
        if (err)throw err
        console.log(rezult[0]);
        res.json(rezult[0])
    })
})

router.post('/pay',(req,res)=> {
    let oid=req.body.oid
    let sql='UPDATE `muk_order` SET `payYet`=? WHERE oid=?';
    pool.query(sql, ['true',oid], (err, rezult) => {
        if (err)throw err
        res.json(rezult.affectedRows)
    })
})



router.post('/orderyet',(req,res)=> {
    let uid=req.body.uid
    let pageSize=parseInt(req.body.pageSize)
    let pageNeed=parseInt(req.body.pageNeed)
    let pageTotal=parseInt(req.body.pageTotal);
    let totalRow=0
    // console.log(pageNeed);
    // console.log(pageSize);
    let sql='SELECT * FROM muk_order WHERE uid=? and cancel=?'
    pool.query(sql, [uid,'false'], (err, rezultotal) => {
        totalRow=rezultotal.length;
        pageTotal=Math.ceil(totalRow/pageSize)
        // console.log(totalRow,'row');

        // console.log(uid);
        sql='SELECT * FROM muk_order INNER JOIN muk_address on muk_order.aid=muk_address.aid WHERE muk_order.uid=? and muk_order.cancel=? order by muk_order.oid limit ? offset ? '
        pool.query(sql, [uid,'false',pageSize,pageSize*(pageNeed-1)], (err, rezultorder) => {
            if (err)throw err
            // console.log(rezultorder);
            let sidarr=[]
            let sidreal=[]
            for (let elem of rezultorder){
                if(sidarr.indexOf(elem.sid)==-1){
                    sidarr.push(elem.sid)
                }
            }
            for (let elem of sidarr){
                if (elem.indexOf("::")==-1){
                    sidreal.push(elem)
                }else{
                    for( let elem2 of elem.split('::')){
                        sidreal.push(elem2)
                    }
                }
            }
            // console.log(sidreal);
            let question=[];
            for (let i=0;i<sidreal.length;i++){
                question.push('?')
            }
            question=question.join(',');
            sql = 'SELECT * FROM muk_cart_selled INNER JOIN product_details on muk_cart_selled.pid=product_details.pid where muk_cart_selled.sid in('+question+')'
            pool.query(sql,sidreal,(err, rezultselled) => {
                // console.log(rezultselled);
                for (let i=0;i<rezultorder.length;i++){
                    rezultorder[i].product=[]
                    if(rezultorder[i].sid.indexOf('::')==-1){
                        for (let j=0;j<rezultselled.length;j++){
                            if(rezultselled[j].sid==rezultorder[i].sid){
                                rezultorder[i].product[0]=rezultselled[j]
                            }
                        }
                    }else if (rezultorder[i].sid.indexOf('::')!=-1){
                        let sidarr=rezultorder[i].sid.split('::')
                        for (let k=0;k<sidarr.length;k++){
                            for (let l=0;l<rezultselled.length;l++){
                                if (sidarr[k]==rezultselled[l].sid){
                                    rezultorder[i].product[k]=rezultselled[l]
                                }
                            }
                        }
                    }
                }
                let pageData={pageSize:pageSize,pageNeed:pageNeed,pageTotal:pageTotal,totalRow:totalRow}
                let rezult={data:rezultorder,pageData:pageData}
                res.json(rezult)
            })
        })
    })
})

router.post('/cancelorder',(req,res)=> {
    let oid=req.body.oid
    let sql='UPDATE `muk_order` SET `cancel`=? WHERE oid=?';
    pool.query(sql, ['true',oid], (err, rezult) => {
        if (err)throw err
        res.json(rezult.affectedRows)
    })
})