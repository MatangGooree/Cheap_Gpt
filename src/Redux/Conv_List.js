import { createSlice } from '@reduxjs/toolkit';

let Conv_List = createSlice({
  name: 'Conv_List',
  initialState: {
    list: [],
  }, // 초기 상태 정의

  reducers: {
    setList(state,action){
      state.list = action.payload;
    }
  },
});

export let { setList} = Conv_List.actions; // 액션을 정확히 추출
export default Conv_List.reducer;
