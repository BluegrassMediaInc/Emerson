import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../util/apiRequest";

const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  contents: [],
  selectedContent: null,
  error: null,
  message: "",
};

export const updateContentApi = createAsyncThunk(
  "content/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await apiRequest(
        baseURL,
        "put",
        `/content/${id}/v1`,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token")
        }
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getContentByIdApi = createAsyncThunk(
  "content/getById",
  async (id, thunkAPI) => {
    try {
      const response = await apiRequest(
        baseURL,
        "get",
        `/content/${id}/v1`,
        null,
        {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        }
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const createContentApi = createAsyncThunk(
  "content/create",
  async (formData, thunkAPI) => {
    try {
      const response = await apiRequest(
        baseURL,
        "post",
        "/create/content/v1",
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token")
        }
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const listContentsApi = createAsyncThunk(
  "content/list",
  async (params, thunkAPI) => {
    const { skip = 1, limit = 10, search = "" } = params || {};
    let endpoint = `/contents/v1?skip=${skip}&limit=${limit}&search=${search ? `${search}` : ""}`;

    try {
      const response = await apiRequest(baseURL, "get", endpoint, null, {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const deleteContentApi = createAsyncThunk(
  "content/delete",
  async (id, thunkAPI) => {
    try {
      const response = await apiRequest(
        baseURL,
        "delete",
        `/content/${id}/v1`,
        {},
        {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        }
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    clearContentMsg: (state) => {
      state.message = "";
      state.error = null;
    },
    clearSelectedContent: (state) => {
      state.selectedContent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listContentsApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listContentsApi.fulfilled, (state, action) => {
        state.loading = false;
        state.contents = action.meta.arg.skip === 0 
          ? action.payload.data.data 
          : [...state.contents, ...action.payload.data.data];
        state.error = null;
      })
      .addCase(listContentsApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.data?.message || "Something went wrong";
      })
      .addCase(createContentApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContentApi.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Content created successfully";
        state.error = null;
      })
      .addCase(createContentApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.data?.message || "Failed to create content";
      })
      .addCase(getContentByIdApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContentByIdApi.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedContent = action.payload.data.data;
        state.error = null;
      })
      .addCase(getContentByIdApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.data?.message || "Failed to fetch content details";
      })
      .addCase(updateContentApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContentApi.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Content updated successfully";
        state.error = null;
      })
      .addCase(updateContentApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.data?.message || "Failed to update content";
      })
      .addCase(deleteContentApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContentApi.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Content deleted successfully";
        state.contents = state.contents.filter(
          (content) => content._id !== action.meta.arg
        );
      })
      .addCase(deleteContentApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.data?.message || "Something went wrong";
      });
  },
});

export const { clearContentMsg, clearSelectedContent } = contentSlice.actions;
export default contentSlice.reducer;
