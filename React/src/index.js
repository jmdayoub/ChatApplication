import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "toastr/build/toastr.css";
import App from "./App";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import "./services/autoLogInService";
import "./assets/scss/theme.scss";
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
