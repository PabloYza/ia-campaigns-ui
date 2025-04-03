import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import userReducer from './slices/userSlice';
import campaignReducer from './slices/campaignsSlice';
import keywordsReducer from './slices/keywordsSlice';
import copiesReducer from './slices/copiesSlice';
import csvReducer from './slices/csvSlice';

const rootReducer = combineReducers({
	user: userReducer,
	campaign: campaignReducer,
	keywords: keywordsReducer,
	copies: copiesReducer,
	csv: csvReducer,
});

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['user']
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