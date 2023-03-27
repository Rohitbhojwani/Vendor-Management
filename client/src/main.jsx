import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { TransactionsProvider } from "./context/TransactionContext";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";


ReactDOM.render(
  <React.StrictMode>
    <Router>
  <TransactionsProvider>
    <App />
  </TransactionsProvider>
  </Router>
  </React.StrictMode>,
  document.getElementById("root"),
);
// --------------------------------------------------------------------------

