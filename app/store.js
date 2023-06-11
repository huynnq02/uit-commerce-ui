import { configureStore } from "@reduxjs/toolkit";
import SettingReducer from "../reducer/setting";
import ShopReducer from "../reducer/shop";

export default configureStore({
  reducer: {
    setting: SettingReducer,
    shop: ShopReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
