import React from "react";
import io from "socket.io-client";

export default class App extends React.Component{
    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
        this.socket = io();
        this.socketLinstener();
    }

    clickHandler(e) {
        e.preventDefault();
        this.socket.emit("request.data", "GOOGL");
    }

    socketLinstener(){
        this.socket.on("new.data", (data) => {
            console.log(data);
        });
    }
    
    render() {
        return(
            <div>
                <button onClick={this.clickHandler}>CLICK</button>
            </div>
        );
    }
}