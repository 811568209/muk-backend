const express=require('express');
const http=require('http');
//引入路由器
const routerCart=require('./route/cart');
const routerNews=require('./route/news');
const routerProduct=require('./route/product');
const routerUser=require('./route/user');
const routerIndexx=require('./route/indexx');
const routerOrder=require('./route/order');
const routerAddress=require('./route/address');
const routerFavorite=require('./route/favorite');

const app=express();
//创建服务器
http.createServer(app).listen(3000);

//引入中间件，并使用
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

const cookieParser=require('cookie-parser');
app.use(cookieParser());

const cors=require('cors');
app.use(cors({
    origin:['http://127.0.0.1',
        'http://localhost',
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://2444f679p9.wicp.vip:37469',
        'http://2444f679p9.wicp.vip:16180',
        'http://192.168.0.135',
    ] ,
    mehods:['put','get','post','delete'],
    credentials:true
}))

const session = require('express-session');
app.use(session({
    secret :  'secret', // 对session id 相关的cookie 进行签名
    resave : true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60 * 60 * 24 * 2, // 设置 session 的有效时间，单位毫秒
    },
}))
app.use((req, res, next)=>{
//中间件要实现的功能
    let now=new Date(),year=now.getFullYear(),month=now.getMonth()+1,data=now.getDate(),hour=now.getHours(),miutes=now.getMinutes()
    let time=year+'.'+month+'.'+data+'.'+hour+'.'+miutes
    console.log(time);
    next()
})




//挂载路由器
app.use('/cart',routerCart);
app.use('/news',routerNews);
app.use('/product',routerProduct);
app.use('/user',routerUser);
app.use('/indexx',routerIndexx);
app.use('/order',routerOrder);
app.use('/address',routerAddress);
app.use('/favorite',routerFavorite);

// app.use('/favorite',(req, res, next)=>{
//     routerFavorite
//     next()
// });
//
// app.use((req, res, next)=>{
// //中间件要实现的功能
//     let now=new Date(),year=now.getFullYear(),month=now.getMonth()+1,data=now.getDate(),hour=now.getHours(),miutes=now.getMinutes()
//     let time=year+'.'+month+'.'+data+'.'+hour+'.'+miutes
//     console.log(time,'end');
//     next()
// })


