const express=require('express');
const app=express();// instance bnana
const bodyParser=require('body-parser');// form ki value ko get krne k liye 
app.use(bodyParser.urlencoded({extended:true}));//bodyparser ko use krne k liye middleware
app.use(bodyParser.json());


const mysql=require('mysql');
app.set('view engine','ejs');

const conn=mysql.createConnection({// connection banane k liye function
    host:'localhost',
    user:'root',
    password:'',
    database:'node'
});
conn.connect((error)=>{
  if(error) throw error;
  
  console.log("connected");
});// connection check krne k liye

app.get('/',(req,resp)=>{
    //resp.send("<h1>Hello</h1>");
    resp.render('insert');// rendr ,method se template ko use kr lete h 
});// route define krna
app.post('/insert',(req,resp)=>{
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;// form se value local variable m aa chuki h 
    // ab usko mysql database m send krne k liye query fire krenge
   var sql=`insert into users(user_name,user_email,user_password) values('${name}','${email}','${password}')`
    conn.query(sql,(err,result)=>{
        if(err) throw err;
        resp.send("<h1> Data sent....</h1>");
    });
});
app.get('/show',(req,resp)=>{
    var sql="select * from users";
    conn.query(sql,(err,result)=>{
      if(err) throw err;
    resp.render('show',{users:result});

    });
      
});
app.get('/delete/:id',(req,resp)=>{
   var id=req.params.id;
   var sql=`delete from users where users_id='${id}'`;
   conn.query(sql,(err,results)=>{
    if(err) throw err;
    resp.redirect('/show');
   });
});
app.get('/edit/:id',(req,resp)=>{
   var id=req.params.id;
    var sql=`select * from users where users_id='${id}'`;
    conn.query(sql,(err,results)=>{
   if(err) throw err;
   resp.render('edit',{users:results});
    });
});

app.post('/update/:id',(req,resp)=>{
  
   var id=req.params.id;

    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;
    var sql=`update users set user_name='${name}',user_email='${email}',user_password='${password}' where users_id='${id}'`;
     conn.query(sql,(err,results)=>{
       if(err) throw err;
       resp.redirect('/show');
     });
});

app.listen(5001,()=>{
    console.warn("App running at port 5001");
});