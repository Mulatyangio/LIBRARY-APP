const express=require('express')
const bcrypt=require('bcrypt')
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
app.get('/signup',(req,res)=>{
    res.render('signup.ejs')
})
app.get('/signin',(req,res)=>{
    res.render('signin.ejs')
})
app.post("/signup",(req,res)=>{
    //get data from html form through req.body
    //check if email provided is in the database(registered users)
    //hash password
    //insert into database
   
    dbconn.query(`SELECT Email FROM members WHERE Email ="${req.body.email}"` , (err,result)=>{
        if(err){
            res.status(500).send('Server Error')}
            else{
                if (result.length>0){
                    //email found
                    res.render('signup.ejs',{errorMessage:"Email already in use. SignUp"})
                }else{
                    //email not found
                    const hashedPassword = bcrypt.hashSync(req.body.password,5);
                    //now store the data
                    dbconn.query(`INSERT INTO members(FullName,Address,Phone,Email,Password,club)VALUES("${req.body.FullName}","${req.body.address}","${req.body.phone}","${req.body.email}","${hashedPassword}",99)`,(error)=>{
                        if (error){
                            res.status(500).send('server error')
                        } else{
                            res.redirect('/signin')
                        }
                   })
                 }
                }
            })
        })        
app.post('/signin',(req,res)=>{
    //get data from html form through req.body
    //check if email provided is in the database(registered users)
    //check if password matches the one in the database bcrypt.comparesync
    //if all is good, redirect to home page/create a session.......what are sessions and why is http stateless ,what are cookies,in web ofc
    console.log(req.body);
    dbconn.query(`SELECT * FROM members WHERE Email ="${req.body.email}"`, (error,member)=>{
        if(error){
            console.log(error);
            res.status(500).send('Server Error')
        }else{
            console.log(member);
            if (member.length==0){
                res.render('signin.ejs',{errorMessage:"Email not registered. Sign Up"})
            }else{
                let passwordMatch=bcrypt.compareSync(req.body.password,member[0].password)
                console.log(passwordMatch);
                res.redirect('/')
        }

        }
    })


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