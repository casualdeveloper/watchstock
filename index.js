const express = require("express");
const app = express();
const path = require("path");
const fetch = require("node-fetch");
const config = require("./config.json");




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
  socket.on("request.data", (data) => {
    let json;
    fetch(`http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${data}&interval=1min&apikey=${config.API_KEY}`)
      .then(res => res.json())
        .then((json)=>{

          json = json;
          sendNewDataToEveryone(json);

      });

  });
});

function sendNewDataToEveryone(data){
  io.sockets.emit("new.data",data);
}
