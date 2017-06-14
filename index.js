const express = require("express");
const app = express();


app.get("/",(req,res)=>{
    res.send("asdasd");
});

const port = process.env.PORT || 8080;

app.listen(port,(err)=>{
    if(err){
        console.log(err);
    }
    console.log("started");
})
