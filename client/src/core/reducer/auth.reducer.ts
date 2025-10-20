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
  roles: string[];
}

// Helper function to safely parse localStorage data
const getStoredData = (key: string, fallback: any = null) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const initialState: AuthState = {
  user: getStoredData(variables.session.userData),
  isAuthenticated: !!localStorage.getItem(variables.session.tokenName),
  isLoading: false,
  error: null,
  permissions: getStoredData(variables.session.userPermissions, []),
  roles: getStoredData(variables.session.userRoles, []),
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: IAuthRequest, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials);
      console.log('Login successful:', response);
      
      // Store token and additional user data
      localStorage.setItem(variables.session.tokenName, response.data.access_token);
      localStorage.setItem(variables.session.userData, JSON.stringify(response.data.user));
      localStorage.setItem(variables.session.userRoles, JSON.stringify(response.data.roles));
      localStorage.setItem(variables.session.userPermissions, JSON.stringify(response.data.permissions));
      
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
      
      // Update localStorage with fresh data
      localStorage.setItem(variables.session.userData, JSON.stringify(response.data.user));
      localStorage.setItem(variables.session.userRoles, JSON.stringify(response.data.roles));
      localStorage.setItem(variables.session.userPermissions, JSON.stringify(response.data.permissions));
      
      return response.data;
    } catch (error: any) {
      localStorage.removeItem(variables.session.tokenName);
      localStorage.removeItem(variables.session.userData);
      localStorage.removeItem(variables.session.userRoles);
      localStorage.removeItem(variables.session.userPermissions);
      return rejectWithValue(error.response?.data?.message || "Could not get user information");
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AuthService.logout();
  localStorage.removeItem(variables.session.tokenName);
  localStorage.removeItem(variables.session.userData);
  localStorage.removeItem(variables.session.userRoles);
  localStorage.removeItem(variables.session.userPermissions);
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
        state.roles = action.payload.roles;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.permissions = [];
        state.roles = [];
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
        state.roles = action.payload.roles;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.roles = [];
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.roles = [];
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;