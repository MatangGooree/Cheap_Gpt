import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

let nowConversation = createSlice({
  name: 'Conversation',
  initialState: {
    convId: '',
    date: '',
    subject:'',
    max: 10,
    memory: [],
    whole: [],
  }, // 초기 상태 정의

  reducers: {
    setNowConversation(state, action) {
      state.convId = action.payload.convId;
      state.date = action.payload.date;
    },
    addChat(state, action) {
      state.date = new Date();

      if (state.convId == '') {
        state.convId = uuidv4();
      }

      if (state.memory.length >= state.max) {
        state.memory.shift(); // 큐에서 가장 오래된 메시지 제거
      }
      state.memory.push(action.payload);
      state.whole.push(action.payload);
    },
  },
});

export let { setNowConversation, addChat } = nowConversation.actions; // 액션을 정확히 추출
export default nowConversation.reducer;
