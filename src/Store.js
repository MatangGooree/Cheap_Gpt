import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './Ui';  // 우리가 만든 슬라이스 리듀서

const store = configureStore({
  reducer: {
    UI: uiReducer  // 슬라이스 리듀서를 store에 등록
  }
});

export default store;
