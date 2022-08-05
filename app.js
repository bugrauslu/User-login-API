const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
require("./Models/Db_Connection"); //DB connection
const UserRoute = require("./Routers/UserAndAdminRoute"); 

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    const routes= {
        register:'/api/register   kayıt olan kullanıcı bilgilerine e mail göndermek için yapılmıştır. (email işlemi nodemailer testacount üzerinden test için yapılmıştır)',
        verify: '/api/verify   ile giriş yapan kullanıcının Emaili aktif olur',
        login: '/api/login   giriş yapma urli',
        me :'/api/me/:id  giriş yapan kullanıcın bilgilerini görmesi',
        update :'/me/update/:id  giriş yapan kullanıcın bilgilerini güncellemesi',
        allusers : '/api/allusers  Adminin tüm kullanıcıları görmesi ',
        delete :'/delete/:id   Userın kendini veya adminin kullanıcıyı silmesi'
        }
    return res.status(200).json(routes);
})

app.use("/api", UserRoute)


app.listen(process.env.PORT || 3000 , ()=> {
    console.log(`server started ${process.env.PORT} `);
});