import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./app/App";
import "./styles/global.css";

const isFileProtocol = window.location.protocol === "file:";
const app = <App />;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isFileProtocol ? <HashRouter>{app}</HashRouter> : <BrowserRouter basename={import.meta.env.BASE_URL}>{app}</BrowserRouter>}
  </React.StrictMode>,
);
