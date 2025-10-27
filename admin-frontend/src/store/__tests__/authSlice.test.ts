import authReducer, { logout, setCredentials } from "../authSlice";

describe("authSlice", () => {
  const initialState = {
    admin: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle setCredentials", () => {
    const mockAdmin = {
      id: "1",
      email: "admin@creditjambo.com",
      name: "Admin User",
    };
    const mockToken = "mock-jwt-token";

    const actual = authReducer(
      initialState,
      setCredentials({ admin: mockAdmin, token: mockToken })
    );

    expect(actual.admin).toEqual(mockAdmin);
    expect(actual.token).toBe(mockToken);
    expect(actual.isAuthenticated).toBe(true);
    expect(actual.error).toBeNull();
  });

  it("should handle logout", () => {
    const authenticatedState = {
      admin: { id: "1", email: "admin@test.com", name: "Admin" },
      token: "mock-token",
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    const actual = authReducer(authenticatedState, logout());

    expect(actual.admin).toBeNull();
    expect(actual.token).toBeNull();
    expect(actual.isAuthenticated).toBe(false);
  });

  it("should maintain state for unknown actions", () => {
    const customState = {
      ...initialState,
      admin: { id: "1", email: "test@test.com", name: "Test" },
      isAuthenticated: true,
    };

    const actual = authReducer(customState, { type: "unknown" });
    expect(actual).toEqual(customState);
  });
});
