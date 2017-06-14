const express = require("express");
const app = express();
const path = require("path");





app.use(express.static(path.resolve(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});
const port = process.env.PORT || 8080;

const server = app.listen(port,(err)=>{
    if(err){
        console.log(err);
    }
    console.log("started");
})

const io = require("socket.io")(server);

io.on("connection", (socket) => {  
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});