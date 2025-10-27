import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./src/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { loadStoredAuth } from "./src/store/authSlice";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

export default function App() {
  useEffect(() => {
    // Load stored authentication on app start
    store.dispatch(loadStoredAuth());
  }, []);

  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <AppNavigator />
      <Toast />
    </Provider>
  );
}
