import { createSlice } from '@reduxjs/toolkit';

let UI = createSlice({
  name: 'UI',
  initialState: { isOpen: false, waitAnswer: false }, // 초기 상태 정의

  reducers: {
    setIsListOpen(state) {
      state.isOpen = !state.isOpen; // 상태 직접 수정
    },
    setWaitAnswer(state,action){
        state.waitAnswer = action.payload;
    }
  },
});

export let { setIsListOpen,setWaitAnswer } = UI.actions; // 액션을 정확히 추출
export default UI.reducer;
