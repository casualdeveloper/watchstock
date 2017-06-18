import React from "react";
import io from "socket.io-client";
import moment from "moment";
import Chart from "chart.js";
import RaisedButton from "material-ui/RaisedButton";
import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";

export default class App extends React.Component{
    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
        this.socket = io();
        this.socketLinstener();
        this.chart = {};
        this.state = {
            error: null
        }
    }

    clickHandler(e) {
        e.preventDefault();
        let stockCode = this.stockInput.value;
        this.socket.emit("request.data", stockCode);
    }

    socketLinstener(){
        this.socket.on("new.data", (data) => {
            console.log(data);
            let processedData = this.processResponseJSON(data);
            if(processedData)
                this.addData(this.processResponseJSON(data));
        });
    }

    processResponseJSON(json){
        if(json["Error Message"]){
            this.setState({error: "Invalid stock code"});
            return null;
        }
        this.setState({error: null});


        let numbers = json["Time Series (Daily)"];
        let label = json["Meta Data"]["2. Symbol"];
        let data = [];
        let labels = [];
        for(let key in numbers){
            if(numbers.hasOwnProperty(key)){
                data.push(numbers[key]["1. open"]);
                labels.push(key);
            }
        }
        return {
            data:data,
            label:label,
            labels: labels
        }
    }

    addData(data){
        let alreadyExists = false;
        this.chart.data.datasets.forEach((dataset) => {
            if(dataset.label === data.label)
                alreadyExists = true
        });

        if(alreadyExists)
            return;


        if(this.chart.data.labels.length === 0){
            this.chart.data.labels = data.labels;
        }

        let newDataSet = {
            label: data.label,
            data: data.data,
            borderColor: newColor(),
            pointRadius:0,
            fill:false
        }


        this.chart.data.datasets.push(newDataSet);
        
        this.chart.options.scales.xAxes[0].time.max = data.labels[0];
        this.chart.options.scales.xAxes[0].time.min = data.labels[data.labels.length - 1];

        this.chart.update();
    }

    chartInit(json){

        let ctx = document.getElementById("myChart").getContext("2d");

        let data = {
            labels: [],
            datasets:[]
        }

        let options = {
            tooltips:{
                mode: "index",
                intersect: false
            },
            hover:{
                mode: "index",
                intersect: false
            },
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                }
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    type: "time",
                    time: {
                        //max: data.labels[0],
                        //min: data.labels[data.labels.length - 1],
                    },
                    ticks: {
                        maxRotation: 0,
                        callback: function(value){
                            if(data.labels.length ===0 || value ==="Invalid data")
                                return;
                            let isValid = moment(value,"MMM-DD-YYYY").isValid();
                            //console.log("value "+value+" isValid "+isValid);
                            return (isValid)?moment(value, "MMM-DD-YYYY").format("MMM DD"):value;
                        }
                    }
                }]
            }
        }

        return new Chart(ctx, {
            type: "line",
            data: data,
            options: options
        });
        
    }

    componentDidMount(){
        this.chart = this.chartInit();
        this.stockInput = document.getElementById("stockInput");
    }
    
    render() {
        return(
            <div>
                <Paper className="main-paper" zDepth={1} rounded={false} >
                    <canvas id="myChart" width="800" height="400"></canvas>
                    <TextField errorText={this.state.error} id="stockInput" hintText="Stock code" /><br />
                    <RaisedButton onTouchTap={this.clickHandler}>Add</RaisedButton>
                </Paper>
            </div>
        );
    }
}


const newColor = () => {
    return "#"+Math.random().toString(16).substr(2,6);
}