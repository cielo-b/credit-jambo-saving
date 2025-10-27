import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { getDeviceInfo } from "../api/axios";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  role: string;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  requiresVerification: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  requiresVerification: false,
};

// Async thunks
export const register = createAsyncThunk(
  "auth/register",
  async (
    data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const deviceInfo = await getDeviceInfo();
      const response = await axios.post("/auth/register", {
        ...data,
        ...deviceInfo,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Registration failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const deviceInfo = await getDeviceInfo();
      const response = await axios.post("/auth/login", {
        ...credentials,
        ...deviceInfo,
      });

      if (response.data.requiresVerification) {
        return rejectWithValue("Device requires verification");
      }

      // Save token
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/auth/me");
      await AsyncStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch profile"
      );
    }
  }
);

export const loadStoredAuth = createAsyncThunk(
  "auth/loadStored",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");

      if (token && userStr) {
        return {
          token,
          user: JSON.parse(userStr),
        };
      }

      return rejectWithValue("No stored auth");
    } catch (error) {
      return rejectWithValue("Failed to load stored auth");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
      state.requiresVerification = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.requiresVerification = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        if (action.payload === "Device requires verification") {
          state.requiresVerification = true;
        }
      })
      // Get Profile
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.user = action.payload;
      })
      // Load Stored Auth
      .addCase(
        loadStoredAuth.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      );
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
