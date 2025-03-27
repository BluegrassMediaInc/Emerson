import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import contentReducer from "./slices/contentSlice";
import ratingReducer from "./slices/ratingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    content: contentReducer,
    rating: ratingReducer,
  },
});
