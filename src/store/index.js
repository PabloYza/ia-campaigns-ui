import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import userReducer from './slices/userSlice';
import campaignReducer from './slices/campaignsSlice';
import csvReducer from './slices/csvSlice';
import keywordStrategyReducer from './slices/keywordStrategySlice'

const rootReducer = combineReducers({
	user: userReducer,
	campaign: campaignReducer,
	csv: csvReducer,
	strategy: keywordStrategyReducer,
});

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['user', 'campaign', 'strategy']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false, // redux-persist needs this
		}),
});
export const persistor = persistStore(store);