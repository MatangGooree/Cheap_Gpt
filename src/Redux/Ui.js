import { createSlice } from '@reduxjs/toolkit';

let isListOpen = createSlice({
    name: 'ListPanel',
    initialState: {isOpen : false},  // 초기 상태 정의

    reducers: {
        setIsListOpen(state) {
            state.isOpen = !state.isOpen;  // 상태 직접 수정
        }
    }
});

export let { setIsListOpen } = isListOpen.actions;  // 액션을 정확히 추출
export default isListOpen.reducer;
