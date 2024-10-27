import { createSlice } from '@reduxjs/toolkit';
import SettingIcon from '../Sources/Setting.svg'
let User = createSlice({
  name: 'User',
  initialState: { jwt: null, Nickname: '', profile_picture: SettingIcon }, // 초기 상태 정의

  reducers: {
    setJwt(state, action) {
      state.jwt = action.payload;
    },
    setNickname(state, action) {
      state.Nickname = action.payload;
    },
    setProfilePicture(state, action) {
      state.profile_picture = action.payload;
    },
  },
});

export let {  setJwt,setNickname,setProfilePicture } = User.actions; // 액션을 정확히 추출
export default User.reducer;
