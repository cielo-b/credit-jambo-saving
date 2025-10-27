import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../api/axios";

interface Device {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceModel: string;
  isVerified: boolean;
  lastUsedAt: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  role: string;
  isVerified: boolean;
  devices: Device[];
  createdAt: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

interface Stats {
  users: {
    total: number;
    verified: number;
    unverified: number;
  };
  devices: {
    pendingVerification: number;
  };
  transactions: {
    total: number;
  };
  financials: {
    totalDeposits: number;
    totalWithdrawals: number;
    totalBalance: number;
  };
}

interface AdminState {
  users: User[];
  transactions: Transaction[];
  pendingDevices: any[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  transactions: [],
  pendingDevices: [],
  stats: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/admin/users", { params: filters });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch users"
      );
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  "admin/fetchTransactions",
  async (
    params: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/admin/transactions", { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch transactions"
      );
    }
  }
);

export const fetchPendingDevices = createAsyncThunk(
  "admin/fetchPendingDevices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/admin/pending-devices");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch pending devices"
      );
    }
  }
);

export const fetchStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/admin/stats");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch statistics"
      );
    }
  }
);

export const verifyDevice = createAsyncThunk(
  "admin/verifyDevice",
  async (
    { deviceId, isVerified }: { deviceId: string; isVerified: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/admin/verify-device", {
        deviceId,
        isVerified,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to verify device"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Transactions
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.transactions = action.payload.transactions;
        }
      )
      // Fetch Pending Devices
      .addCase(
        fetchPendingDevices.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.pendingDevices = action.payload;
        }
      )
      // Fetch Stats
      .addCase(fetchStats.fulfilled, (state, action: PayloadAction<Stats>) => {
        state.stats = action.payload;
      })
      // Verify Device
      .addCase(verifyDevice.fulfilled, (state) => {
        // Refetch will be triggered by component
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
