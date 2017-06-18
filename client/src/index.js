import React from "react";
import { render } from "react-dom";
import App from "./components/App.js";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";
import "./index.css";

injectTapEventPlugin();

render(<MuiThemeProvider><App /></MuiThemeProvider>,document.getElementById("root"));