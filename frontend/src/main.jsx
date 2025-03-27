import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <Provider store={store}>
      <Toaster position="top-right" reverseOrder={false} />
      <App />
    </Provider>
  </React.Fragment>
);
