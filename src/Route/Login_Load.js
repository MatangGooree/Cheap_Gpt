import React, { useEffect } from 'react';
import axios from 'axios';

const Login_Load = () => {
  const authenticateUser = async (aCode) => {
    try {
      // 인증 코드를 서버로 전송
      const response = await axios.post(`${process.env.REACT_APP_SERVER_IP  }/auth/google`, { code: aCode });

      const { token } = response.data; // JWT 받아오기

      // JWT를 로컬 스토리지에 저장
      sessionStorage.setItem('jwt', token);

      // 이후 메인 페이지로 리디렉션
      window.location.href = '/';
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code'); // URL에서 인증 코드 가져오기
    if (code) {
      authenticateUser(code); // 사용자 인증 수행
    }
  }, []); // 빈 배열을 사용하여 컴포넌트가 마운트될 때만 실행

  return <div>로그인 처리 중...</div>; // 사용자에게 로그인 처리 중임을 알림
};

export default Login_Load;
