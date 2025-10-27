import authReducer, { setCredentials, logout } from "../authSlice";

describe("authSlice (Mobile)", () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle setCredentials", () => {
    const mockUser = {
      id: "1",
      email: "user@creditjambo.com",
      fullName: "John Doe",
      phoneNumber: "1234567890",
    };
    const mockToken = "mock-jwt-token";

    const actual = authReducer(
      initialState,
      setCredentials({ user: mockUser, token: mockToken })
    );

    expect(actual.user).toEqual(mockUser);
    expect(actual.token).toBe(mockToken);
    expect(actual.isAuthenticated).toBe(true);
  });

  it("should handle logout", () => {
    const authenticatedState = {
      user: {
        id: "1",
        email: "user@test.com",
        fullName: "John Doe",
        phoneNumber: "1234567890",
      },
      token: "mock-token",
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    const actual = authReducer(authenticatedState, logout());

    expect(actual.user).toBeNull();
    expect(actual.token).toBeNull();
    expect(actual.isAuthenticated).toBe(false);
  });

  it("should preserve other state properties when setting credentials", () => {
    const stateWithError = {
      ...initialState,
      error: "Some error",
    };

    const mockUser = {
      id: "1",
      email: "user@test.com",
      fullName: "Jane Doe",
      phoneNumber: "9876543210",
    };

    const actual = authReducer(
      stateWithError,
      setCredentials({ user: mockUser, token: "new-token" })
    );

    expect(actual.user).toEqual(mockUser);
    expect(actual.isAuthenticated).toBe(true);
  });
});
