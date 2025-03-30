import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import campaignReducer from './slices/campaignSlice';
import keywordsReducer from './slices/keywordsSlice';
import copiesReducer from './slices/copiesSlice';
import csvReducer from './slices/csvSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    campaign: campaignReducer,
    keywords: keywordsReducer,
    copies: copiesReducer,
    csv: csvReducer,
  },
});