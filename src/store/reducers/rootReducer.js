import cmtReducer from "./commentSlice";
import basketReducer from "./basketSlice";
import productsReducer from "./productsSlice";
import usersReducer from "./user";
import settingsReducer from "./setting";
export const rootReducers = {
  comments: cmtReducer,
  basket: basketReducer,
  products: productsReducer,
  users: usersReducer,
  settings: settingsReducer,
};
