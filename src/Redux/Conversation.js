import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

let nowConversation = createSlice({
  name: 'Conversation',
  initialState: {
    convId: '',
    date: '',
    subject:'',
    whole: [],
  }, // 초기 상태 정의

  reducers: {
    setNowConversation(state, action) {
      state.convId = action.payload.convId;
      state.date = action.payload.date;
    },
    addChat(state, action) {
      state.date = new Date();
      state.whole.push(action.payload);
    },
  },
});

export let { setNowConversation, addChat } = nowConversation.actions; // 액션을 정확히 추출
export default nowConversation.reducer;
