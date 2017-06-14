import React from "react";
import { render } from "react-dom";
import App from "./components/App.js";
import "./index.css";
import io from "socket.io-client";


render(<App />,document.getElementById("root"));