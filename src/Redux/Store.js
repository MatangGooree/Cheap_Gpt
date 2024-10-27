
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 기본적으로 로컬 스토리지를 사용
import uiReducer from './Ui';  
import conversation from './Conversation'

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  UI: uiReducer,
  Conversation: conversation,
});

const persistedReducer = persistReducer(persistConfig,rootReducer);


const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };
