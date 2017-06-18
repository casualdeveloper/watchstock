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

const stocks=[];

io.on("connection", (socket) => {  

  socket.emit("current.data",stocks);

  socket.on("request.data", (data) => {
    let json;
    fetch(`http://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${data}&apikey=${config.API_KEY}`)
      .then(res => res.json())
        .then((json)=>{

          json = json;
          if(!json["Error Message"])
            stocks.push(json);
          sendNewDataToEveryone(json);

      });

  });

  socket.on("delete.data.server", index => {
    stocks.splice(index,1);
    io.sockets.emit("delete.data.client", index);
  });

});

function sendNewDataToEveryone(data){
  io.sockets.emit("new.data",data);
}
