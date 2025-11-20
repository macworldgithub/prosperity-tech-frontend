import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import loginSlice from "@/reduxSlices/loginSlice";

// Combine reducers
const rootReducer = combineReducers({
  login: loginSlice.reducer,
});

// Persist configuration
const persistConfig = {
  key: "flywing-kiwi-root",
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Redux Persist needs this to avoid warnings
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Define RootState and AppDispatch Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
