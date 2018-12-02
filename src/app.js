import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import AppRouter from "./routers/AppRouter";
import "semantic-ui-css/semantic.min.css";

const userState = {
  login: true
};

const guestState = {
  login: false
};

function initState() {
  if (localStorage.getItem("jwtToken") === null) {
    return guestState;
  } else {
    return userState;
  }
}

const reducer = (state = initState(), action) => {
  switch (action.type) {
    case "LOGGED_IN":
      return (state = { login: true });
    case "LOGGED_OUT":
      return (state = { login: false });

    default:
      return state;
  }
};

const store = createStore(reducer);

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(jsx, document.getElementById("app"));
