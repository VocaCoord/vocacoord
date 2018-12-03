import React from "react";
import { Provider } from "react-redux";
import AppNavigator from "../AppNavigator.js";
import configureStore from "../store/configureStore";

const { store } = configureStore();

const Root = () => (
  <Provider store={store}>
    <AppNavigator />
  </Provider>
);

export default Root;
