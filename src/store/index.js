/**
 * Redux store
 * file: (store/reducers) index.js
 */

import { configureStore } from "@reduxjs/toolkit";
import { rootReducers } from "./reducers/rootReducer";

const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export default store;
