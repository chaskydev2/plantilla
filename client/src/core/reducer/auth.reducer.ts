// auth.slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import variables from '@/core/config/variables';
import type { IAuth, IAuthRequest } from '@/core/types/IAuth';
import { AuthService } from '@/core/services/auth/auth.service';
import type { IPermission } from '@/core/types/IPermission';

interface AuthState {
  user: IAuth | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  permissions: IPermission[];
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: !!localStorage.getItem(variables.session.tokenName),
  isLoading: false,
  error: null,
  permissions: [],
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: IAuthRequest, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials);
      localStorage.setItem(variables.session.tokenName, response.data.access_token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.me();
      return response.data;
    } catch (error: any) {
      localStorage.removeItem(variables.session.tokenName);
      return rejectWithValue(error.response?.data?.message || "No se pudo obtener el usuario");
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AuthService.logout();
  localStorage.removeItem(variables.session.tokenName);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.permissions = action.payload.permissions;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.permissions = [];
      })

      // GetMe
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.permissions = action.payload.permissions;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.permissions = [];
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;