import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../util/apiRequest";

const baseURL = import.meta.env.VITE_BASE_URL;

const initialState = {
  loading: false,
  ratings: [],
  averageRating: null,
  totalRatings: 0,
  error: null,
  message: "",
};

export const addRatingApi = createAsyncThunk(
  "rating/add",
  async ({ id, rating, comment }, thunkAPI) => {
    try {
      const response = await apiRequest(
        baseURL,
        "post",
        `/create/rating/${id}/v1`,
        { rating, comment },
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

export const listRatingsApi = createAsyncThunk(
  "rating/list",
  async (id, thunkAPI) => {
    try {
      const response = await apiRequest(
        baseURL,
        "get",
        `/list/rating/${id}/v1`,
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

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    clearRatingMsg: (state) => {
      state.message = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addRatingApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRatingApi.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Rating added successfully";
        state.error = null;
      })
      .addCase(addRatingApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.data?.message || "Failed to add rating";
      })
      .addCase(listRatingsApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listRatingsApi.fulfilled, (state, action) => {
        state.loading = false;
        state.ratings = action.payload.data.ratings;
        state.averageRating = action.payload.data.averageRating;
        state.totalRatings = action.payload.data.totalRatings;
        state.error = null;
      })
      .addCase(listRatingsApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.data?.message || "Failed to fetch ratings";
      });
  },
});

export const { clearRatingMsg } = ratingSlice.actions;
export default ratingSlice.reducer; 