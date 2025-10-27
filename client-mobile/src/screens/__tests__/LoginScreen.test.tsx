import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import LoginScreen from "../LoginScreen";
import authReducer from "../../store/authSlice";

// Mock navigation
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Create mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

describe("LoginScreen", () => {
  it("should render login form", () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    expect(screen.getByText(/Welcome to Credit Jambo/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Email/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Password/i)).toBeTruthy();
    expect(screen.getByText(/Login/i)).toBeTruthy();
  });

  it("should have register link", () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    expect(screen.getByText(/Don't have an account/i)).toBeTruthy();
    expect(screen.getByText(/Register/i)).toBeTruthy();
  });
});
