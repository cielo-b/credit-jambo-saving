import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../api/axios";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  status: string;
  createdAt: string;
}

interface TransactionState {
  transactions: Transaction[];
  balance: number;
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

const initialState: TransactionState = {
  transactions: [],
  balance: 0,
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
};

// Async thunks
export const deposit = createAsyncThunk(
  "transaction/deposit",
  async (
    data: { amount: number; description?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/transactions/deposit", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Deposit failed");
    }
  }
);

export const withdraw = createAsyncThunk(
  "transaction/withdraw",
  async (
    data: { amount: number; description?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/transactions/withdraw", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Withdrawal failed"
      );
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  "transaction/fetchHistory",
  async (
    params: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/transactions/history", { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch transactions"
      );
    }
  }
);

export const fetchBalance = createAsyncThunk(
  "transaction/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/transactions/balance");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch balance"
      );
    }
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetTransactions: (state) => {
      state.transactions = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Deposit
      .addCase(deposit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deposit.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.newBalance;
        state.transactions.unshift(action.payload.transaction);
      })
      .addCase(deposit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Withdraw
      .addCase(withdraw.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.newBalance;
        state.transactions.unshift(action.payload.transaction);
      })
      .addCase(withdraw.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Transactions
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.transactions = action.payload.transactions;
          state.hasMore =
            action.payload.pagination.page <
            action.payload.pagination.totalPages;
        }
      )
      // Fetch Balance
      .addCase(fetchBalance.fulfilled, (state, action: PayloadAction<any>) => {
        state.balance = action.payload.balance;
      });
  },
});

export const { clearError, resetTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
