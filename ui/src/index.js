import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import React from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "./context/auth-context";
import Routes from "./Routes";
import * as serviceWorker from "./serviceWorker";

const theme = createTheme({
  palette: {
    primary: {
      main: "#141e39", // your primary color
    },
    secondary: {
      main: "#00ff00", // your secondary color
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
