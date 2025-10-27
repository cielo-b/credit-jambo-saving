import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Layout from "../Layout";
import authReducer from "../../store/authSlice";
import adminReducer from "../../store/adminSlice";

// Mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      admin: adminReducer,
    },
    preloadedState: initialState,
  });
};

describe("Layout Component", () => {
  const renderWithProviders = (
    component: React.ReactElement,
    initialState = {}
  ) => {
    const store = createMockStore(initialState);
    return render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    );
  };

  it("should render layout with admin info when authenticated", () => {
    const initialState = {
      auth: {
        isAuthenticated: true,
        admin: {
          id: "1",
          email: "admin@creditjambo.com",
          name: "Admin User",
        },
        token: "mock-token",
        loading: false,
        error: null,
      },
    };

    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>,
      initialState
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("Credit Jambo Admin")).toBeInTheDocument();
  });

  it("should render children content", () => {
    const initialState = {
      auth: {
        isAuthenticated: true,
        admin: { id: "1", email: "admin@test.com", name: "Admin" },
        token: "mock-token",
        loading: false,
        error: null,
      },
    };

    renderWithProviders(
      <Layout>
        <div data-testid="child-content">Child Component</div>
      </Layout>,
      initialState
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });
});
