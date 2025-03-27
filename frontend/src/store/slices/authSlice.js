import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../util/apiRequest";

const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  emailVerificationLoading: true,
  userId: null,
  msg: "",
  userInfo: null,
  error: null,
  profileLoading: false,
  updateProfileLoading: false,
  logoutLoading: false,
};

export const loginApi = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    let endpoint = "/auth/login/v1";

    try {
      const response = await apiRequest(baseURL, "post", endpoint, userData, {
        "Content-Type": "application/json",
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const registerClientApi = createAsyncThunk(
  "auth/registration",
  async (userData, thunkAPI) => {
    let endpoint = "/auth/register/v1";

    try {
      const response = await apiRequest(baseURL, "post", endpoint, userData, {
        "Content-Type": "application/json",
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getProfileApi = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const endPoint = "/user/profile/v1";
      const response = await apiRequest(baseURL, "get", endPoint, null, {
        Authorization: localStorage.getItem('token')
      });
      return response;
    } catch (error) {
      console.error("error", error);
      return rejectWithValue(error.response);
    }
  }
);

export const updateProfileApi = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const endPoint = "/user/profile/v1";
      const response = await apiRequest(baseURL, "put", endPoint, formData, {
        Authorization: localStorage.getItem('token')
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const logoutApi = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const endPoint = "/user/logout/v1";
      const response = await apiRequest(baseURL, "post", endPoint, {}, {
        Authorization: localStorage.getItem('token')
      });
      localStorage.removeItem("token");
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearMsg: (state) => {
      state.msg = "";
    },
  },
  extraReducers(builder) {
    builder
      // Login cases
      .addCase(loginApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginApi.fulfilled, (state, action) => {
        state.loading = false;
        state.msg = action.payload?.data?.message;
      })
      .addCase(loginApi.rejected, (state) => {
        state.loading = false;
      })
      // Register cases
      .addCase(registerClientApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerClientApi.fulfilled, (state, action) => {
        state.loading = false;
        state.msg = action.payload?.data?.message;
      })
      .addCase(registerClientApi.rejected, (state) => {
        state.loading = false;
      })
      // Get Profile cases
      .addCase(getProfileApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfileApi.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload?.data?.data;
      })
      .addCase(getProfileApi.rejected, (state) => {
        state.loading = false;
      })
      // Update Profile cases
      .addCase(updateProfileApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfileApi.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload?.data?.data;
        state.msg = action.payload?.data?.message;
      })
      .addCase(updateProfileApi.rejected, (state) => {
        state.loading = false;
      })
      // Logout cases
      .addCase(logoutApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutApi.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = null;
        state.msg = action.payload?.data?.message;
      })
      .addCase(logoutApi.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { clearMsg } = authSlice.actions;
export default authSlice.reducer;
