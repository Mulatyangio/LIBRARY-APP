const express=require('express')
const mysql=require('mysql')
const dbconn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'librarydb'
})
const app= express()
//middleware application
app.use(express.urlencoded({extended:true}))
app.use((req,res,next)=>{
    console.log("current request path",req.path);

    next ()
})

app.get('/',(req,res)=>{
    res.render('index.ejs')
})
app.get('/authors',(req,res)=>{
    dbconn.query('SELECT * FROM authors',(err,authors)=>{
        if (err){
            res.status(500).send('error occured')
        }else{
             res.render('authors.ejs',{authors})
        }
    })


   
})
app.get('/auth',(req,res)=>{
    
    res.send('hi there')
})
app.get('/books/:id',(req,res)=>{
    console.log(req.params.id);
    res.send('hi there')
})
app.post('/newauthor',(req,res)=>{
    console.log('posting author');
    let sql=`INSERT INTO authors (FullName, Nationality,YOB,Biography,AuthorID) VALUES('${req.body.name}','${req.body.nationality}','${req.body.YOB}','${req.body.bio}','${req.body.id}')`
    console.log(sql);
    dbconn.query(sql,(err,authors)=>{
        if (err){
            res.status(500).send('error occured')
        }else{
             res.redirect('/authors')
        }
    })
   
})
app.get('/books',(req,res)=>{
    console.log('Getting books');
    res.render('books.ejs')
})
app.get('/profile',(req,res)=>{
    console.log('Getting profile');
    res.render('profile.ejs')
})
//last route
app.get('*',(req,res)=>{
    res.status(404).render('404.ejs')
})
app.listen(8000,()=>console.log("app is listening on port 8000"))