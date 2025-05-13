import { combineReducers, configureStore } from "@reduxjs/toolkit";
import devices from "./devices/devicesSlice";
import users from "./users/usersSlice";
import products from "./products/productsSlice";
import revenues from "./revenues/revenuesSlice";
import auth from "./auth/authSlice";
import history from "./history/historySlice"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PURGE,
  PAUSE,
  PERSIST,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken", "user"],
};

const rootReducer = combineReducers({
  devices,
  users,
  products,
  revenues,
  history,
  auth: persistReducer(authPersistConfig, auth),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PURGE, PAUSE, PERSIST, REGISTER],
      },
    }),
});

export default store;
export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
