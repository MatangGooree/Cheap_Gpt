import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

let nowConversation = createSlice({
  name: 'Conversation',
  initialState: {
    convId: null,
    date: '',
    whole: [],
  }, // 초기 상태 정의

  reducers: {
    setConvId(state, action) {
      state.convId = action.payload;
    },
    setConvDate(state, action) {
      state.date = new Date();
    },
    setConv(state, action) {
      state.whole = action.payload
    },
  },
});

export let { setConvId, setConvDate, setConv } = nowConversation.actions; // 액션을 정확히 추출
export default nowConversation.reducer;
