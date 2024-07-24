var express=require("express");
let app=express();
var fileuploader=require("express-fileupload");
var nodemailer = require("nodemailer");

app.use(fileuploader());

app.use(express.static("public"));
app.use(express.urlencoded("true"));

let mysql2=require("mysql2");

/*
let config={
    host:"127.0.0.1",
    user:"root",
    password:"Abhishek0003@",
    database:"project",
    dateStrings:true
}
*/

let config={
    host:"bbn9gl6pblskxiidomro-mysql.services.clever-cloud.com",
    user:"uhsfrwqhipurju0b",
    password:"fy8s4JTzNP5VRgoqAJEp",
    database:"bbn9gl6pblskxiidomro",
    dateStrings:true,
    keepAliveDelay: 10000,
    enableKeepAlive: true,
}

let transporter=nodemailer.createTransport({
    host: "abhi2004bansal@gmail.com",
    port: 587,
    secure: false,
    service:'gmail',
    auth:{
        user:"abhi2004bansal@gmail.com",
        pass:'abhi'
    }
});

var mysql=mysql2.createConnection(config);
mysql.connect(function(err){
    if(err==null){
        console.log("Connected To database successfullyyy");
    }
    else{
        console.log(err.message);
    }
})

app.listen(2004,function(req,resp){
    console.log("Your Server is started");
})

app.get("/",function(req,resp){
    let path=__dirname+"/public/index.html";
    resp.sendFile(path);
})

app.get("/signup-process",function(req,resp){
    console.log(req.query);

    let email=req.query.txtEmail;
    let pwd=req.query.pwd;
    let utype=req.query.combo;

    mysql.query("insert into users values(?,?,?,1)",[email,pwd,utype],function(err){
        if(err==null){
            resp.send("SignedUp Successfullyy");
        }
        else{
            resp.send(err.message);
        }
    })
})

app.get("/login-process",function(req,resp){
    console.log(req.query);

    let emaill=req.query.txtEmaill;
    let txtPwd=req.query.txtPwd;

    mysql.query("select * from users where email=? and pwd=?",[emaill,txtPwd],function(err,result){
        if(err!=null){
            resp.send(err.message);
            return ;
        }
        if(result.length==0){
            resp.send("Invalid ID or password");
            return ;
        }
        if(result[0].status==1){
            resp.send(result[0].utype);
            return ;
        }
        else{
            resp.send("You are Blocked");
            return ;
        }
    })
})


app.get("/post-event-process",function(req,resp){
    console.log(req.query);

    let emailid=req.query.emailid;
    let eve=req.query.eve;
    let doe= req.query.doe;
    let tos=req.query.tos;
    let city=req.query.city;
    let venue=req.query.venue;

    mysql.query("insert into eventss values(?,?,?,?,?,?)",[emailid,eve,doe,tos,city,venue],function(err){
        if(err==null){
            resp.send("Posted Bookings Successfullyy");
        }
        else{
            resp.send(err.message);
        }
    })
})

app.post("/inf-save-process",function(req,resp){
    let fileName=req.files.ppic.name;
    let path=__dirname+"/public/uploads/"+fileName;
    req.files.ppic.mv(path);

    //let ary=req.body.cities;

    mysql.query("insert into IProfile values(?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.emailid, req.body.iname, req.body.gender, req.body.dob, req.body.address, req.body.city, req.body.contact, req.body.field.toString(), req.body.insta, req.body.fb, req.body.youtube, req.body.other, fileName],function(err){
        if(err==null){
            resp.send("Saved Successfullly");
        }
        else{
            resp.send(err.message);
        }
    })
})

app.post("/inf-update",function(req,resp){
    console.log(req.body);
    
    let fileName="";
    if(req.files!=null){
        fileName=req.files.ppic.name;
        let path=__dirname+"/public/uploads/"+fileName;
        req.files.ppic.mv(path);
    }
    else{
        fileName=req.body.hdn;
    }
    //req.body.ppic=fileName;
    //resp.send(req.body);

    mysql.query("update IProfile set iname=?, gender=?, dob=?, address=?, city=?, contact=?, field=?, insta=?, fb=?, youtube=?, other=?, picpath=? where emailid=?",[req.body.iname, req.body.gender, req.body.dob, req.body.address, req.body.city, req.body.contact, req.body.field.toString(), req.body.insta, req.body.fb, req.body.youtube, req.body.other, fileName,req.body.emailid],function(err,result){
        if(err==null){
            if(result.affectedRows>=1){
                resp.send("Record Updated successfulllyy....");
            }
            else{
                resp.send("Invalid Email ID");
            }
        }
        else{
            resp.send(err.message);
        }
    })
})

app.get("/check-user-existance", function(req,resp){
    let emailid=req.query.emailid;
    mysql.query("select * from IProfile where emailid=?",[emailid],function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return ;
        }
        if(resultJsonAry.length==0){
            resp.send("Yess!! Available :-) ");
        }
        else{
            resp.send("Soorrrryyyyy Already Taken....");
        }
    })
})

app.get("/find-user-details", function(req,resp){
    let emailid=req.query.emailid;
    mysql.query("select * from IProfile where emailid=?",[emailid],function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return ;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry); //sending array of json object 0-1
    })
})

app.get("/pwd-update",function(req,resp){
    let email=req.query.email;
    let newPwd=req.query.newPwd;
    let oldPwd=req.query.oldPwd;
    let repPwd=req.query.repPwd;
    change=req.query.change;
    mysql.query("select pwd from users where email=?",[email],function(err,result){
        if(err==null){
            if(oldPwd==result[0].pwd){
                if(newPwd==repPwd){
                    mysql.query("update users set pwd=? where email=?",[newPwd,email],function(err,result){
                        if(err=null)  //no error
                        {
                            resp.send("Password Updated Successfullllyyyyy....");
                            return ;
                        }
                    })
                }
            }
        }
        else{
            resp.send(err.message);
        }
    })
})

app.get("/send-mail",function(req,resp){
    console.log(req.query);

    let retPwd;
    let email=req.query.txtEmaill;

    mysql.query("select * from users where email=?",[email],function(err,result){
        if(err==null){
            console.log(result.pwd);
            let retPwd=result.pwd;
            let transporter=nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:"abhi2004bansal@gmail.com",
                    pass:'abhi'
                }
            });

            var mailOptions={
                from:'abhi2004bansal@gmail.com',
                to: req.query.mail,
                subject: 'Sending Email using Node.js',
                html:"Thank You for placing your order <br> Visit Again!"+ retPwd,
            };

            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error);
                }
                else{
                    console.log("Email sent: "+ info.response);
                }
            });

            transporter.verify(function(error, success) {
                if (error) {
                      console.log("Connection error:",error);
                } else {
                      console.log('Server is ready to take our messages');
                }
              });

            resp.send("Password Retreived");
        }
        else{
            resp.send(err.message);
        }
    })
})

app.get("/fetch-all",function(req,resp){
    mysql.query("select * from users",function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return ;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry); //sending array of json object 0-1
    })
})

app.get("/del-one",function(req,resp){
    let email=req.query.email;
    mysql.query("delete from users where email=?",[email],function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return ;
        }
        console.log(resultJsonAry);
        resp.send("Deleted Account Successfullyyyy"); //sending array of json object 0-1
    })
})

app.get("/block-one",function(req,resp){
    let email=req.query.email;
    let status='0';
    mysql.query("update users set status=? where email=?",[status,email],function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return ;
        }
        console.log(resultJsonAry);
        resp.send("Blocked"); //sending array of json object 0-1
    })
})

app.get("/resume-one",function(req,resp){
    let email=req.query.email;
    let status='1';
    mysql.query("update users set status=? where email=?",[status,email],function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return ;
        }
        console.log(resultJsonAry);
        resp.send("You can Now Resume Your Journey"); //sending array of json object 0-1
    })
})

app.get("/fetch-all-infl",function(req,resp){
    mysql.query("select * from IProfile",function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return ;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry); //sending array of json object 0-1
    })
})

app.get("/fetch-all-fields",function(req,resp){
    mysql.query("select * from IProfile where field like ?",["%"+req.query.field+"%"],function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return ;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry); //sending array of json object 0-1
    })
})

app.get("/do-find-All",function(req,resp){
    mysql.query("select * from IProfile where field like ? && city=?",["%"+req.query.field+"%",req.query.city],function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return ;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry); //sending array of json object 0-1
    })
})

app.get("/do-find-by-name",function(req,resp){
    mysql.query("select * from IProfile where iname like ?",["%"+req.query.name+"%"],function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return ;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry); //sending array of json object 0-1
    })
})

app.post("/client-save-process",function(req,resp){
    console.log(req.body);
    mysql.query("insert into cprofile values(?,?,?,?,?,?)",[req.body.email, req.body.name, req.body.city, req.body.state, req.body.org, req.body.mobile],function(err){
        if(err==null){
            resp.send("Saved Successfullly");
        }
        else{
            resp.send(err.message);
        }
    })
})

app.post("/client-update-process",function(req,resp){
    mysql.query("update cprofile set email=?, name=?, city=?, state=?, org=?, mobile=?",[req.body.email, req.body.name, req.body.city, req.body.state, req.body.org, req.body.mobile],function(err,result){
        if(err==null){
            if(result.affectedRows>=1){
                resp.send("Record Updated successfulllyy....");
            }
            else{
                resp.send("Invalid Email ID");
            }
        }
        else{
            resp.send(err.message);
        }
    })
})

app.get("/find-client-details", function(req,resp){
    let email=req.query.email;
    mysql.query("select * from cprofile where email=?",[email],function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return ;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry); //sending array of json object 0-1
    })
})

app.get("/fetch-all-events", function(req,resp){
    mysql.query("select * from eventss where curdate()<doe",function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return ;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry); //sending array of json object 0-1
    })
})