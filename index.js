const express=require('express');
const mongoose=require('mongoose');
const routes = require('./routes/routes');
const cookieParser=require('cookie-parser');
const dotenv=require('dotenv');
const jwt=require('jsonwebtoken');
const app=express();

const PORT=5000;

dotenv.config();

console.log(process.env.username);

mongoose.connect(`mongodb+srv://${process.env.username}:${process.env.password}@cluster0.eijzdgu.mongodb.net/${process.env.database}`)
.then(()=>{
    console.log("DB Connected");
}).catch((err)=>{
    console.log(err);
});

app.use(express.json());
app.use(cookieParser());

app.use(routes);

app.listen(PORT, ()=> {
    console.log("Server is listening at port "+PORT);
});