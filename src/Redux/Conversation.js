import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

let nowConversation = createSlice({
  name: 'Conversation',
  initialState: {
    convId: '',
    date: '',
    whole: [],
  }, // 초기 상태 정의

  reducers: {
    setConvId(state, action) {
      state.convId = action.payload.convId;
    },
    setConvDate(state,action){
      state.date = new Date();
    },
    addChat(state, action) {
      state.whole.push(action.payload);
    },
  },
});

export let { setConvId: setNowConversation, addChat } = nowConversation.actions; // 액션을 정확히 추출
export default nowConversation.reducer;
