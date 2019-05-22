/**
 * Created by CONSON on 2019/4/24.
 */
const pool=require('../pool');
const express=require('express');
let router=express.Router();
module.exports=router

/**
 *用户登录验证
 *请求参数：
 unameOrPhone-用户名或密码
 upwd-密码
 *输出结果：
 * {"code":1,"uid":1,"uname":"test","phone":"13012345678"}
 * 或
 * {"code":400}
 */

router.post('/login',(req,res)=>{
    //读取请求数据
    let uname= req.body.uname
    let upwd= req.body.upwd

    // uname=="" && res.json({code:0,mesg:'用户名不能为空'});
    if (uname==""){
        console.log('用户名为空');
        res.json({code:0,mesg:'用户名不能为空'});
        return;
    }
    // upwd=="" && res.json({code:0,mesg:'密码不能为空'});
    if(upwd==""){
        console.log('密码为空');
        res.json({code:0,mesg:'密码不能为空'});
        return;
    }
    let sql='select * from muk_user where uname=? and upwd=?';
    pool.query(sql, [uname,upwd],(err,rezult)=>{
        if (err)throw err;
        if(rezult[0]==null){
            res.json({code:-1,mesg:'账号或密码错误'})
        }else{
            req.session.uid=rezult[0].uid;
            console.log("设置session:",req.session.uid);
            console.log('session-id:',req.session.id);
            for (key in rezult[0]){
                key=='upwd' && (rezult[0].upwd='*****')
            }
            rezult[0].code=1
            res.json(rezult[0])
        }
    })
});

router.post('/islogin',(req,res)=>{
    //读取请求数据
    console.log("获取session:",req.session.uid);
    console.log('session-id:',req.session.id);
    //返回响应消息
    let uid= req.session.uid
    if (uid!=undefined){
        let sql='select * from muk_user where uid=?';
        pool.query(sql,[uid],(err,rezult)=>{
            if (err)throw err;
            if(rezult[0]==null){
                res.json({code:-1,mesg:'用户不存在'})
            }else{
                req.session.uid=rezult[0].uid;
                for (key in rezult[0]){
                    key=='upwd' && (rezult[0].upwd='*****')
                }
                rezult[0].code=1
                res.json(rezult[0])
            }
        })
    }else{
        res.json({code:-2,mesg:'session 过期'})
    }
});

router.post('/logout',(req,res)=>{
    console.log("获取session:",req.session.uid);
    console.log('session-id:',req.session.id);
    req.session.uid=null
    res.json({code:1,mesg:'logout success'})
})

router.post('/register',(req,res)=>{
    //读取请求数据
    let uname= req.body.uname;
    let upwd= req.body.upwd;
    let gender=req.body.gender;
    let name=req.body.name;
    // console.log(req.body);
    let sql='select * from muk_user where uname=?';
    pool.query(sql, [uname],(err,rezult)=>{
        if (err)throw err;
        if(rezult.length!=0){
            res.json({code:0,mesg:"用户名已存在！"})
        }else {
            sql='INSERT INTO `muk_user` VALUES (?,?,?,?,?,?,?,?)';
            pool.query(sql, [null,uname,upwd,'',name,gender,'',''],(err,rezult)=>{
                if (err)throw err
                // console.log(rezult.affectedRows);
                if (rezult.affectedRows==1){
                    // console.log(rezult.insertId);
                    req.session.uid=rezult.insertId;
                    res.json({code:1,mesg:"注册成功！",uid:rezult.insertId})
                }
            })
        }
    })
    //返回响应消息
});

router.post('/persondata',(req,res)=>{
    //读取请求数据
    let uid= req.body.uid;
    console.log(req.body);
    let sql='select * from muk_user where uid=?';
    pool.query(sql, [uid],(err,rezult)=>{
        if (err)throw err;
        if (rezult.length==1){
            for (key in rezult[0]){
                key=='upwd' && (rezult[0].upwd='*****')
            }
            res.json(rezult[0])
        }else{

        }
    })
    //返回响应消息
});

router.post('/changdata',(req,res)=>{
    //读取请求数据
    let uid= req.body.uid;
    let email=req.body.email
    let name=req.body.name
    let birthday=req.body.birthday;
    let phone=req.body.phone;
    let gender=req.body.gender
    console.log(req.body);
    let sql='UPDATE `muk_user` SET `phone`=?,`name`=?,`gender`=?,`birthday`=?,`email`=? WHERE uid=?';
    pool.query(sql, [phone,name, gender,birthday,email,uid],(err,rezult)=>{
        if (err)throw err;
        // console.log(rezult.affectedRows);
        if (rezult.affectedRows==1){
            res.json({code:'ok',mesg:'修改成功！'})
        }
    })
    //返回响应消息
});








