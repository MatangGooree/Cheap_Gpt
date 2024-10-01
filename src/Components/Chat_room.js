import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react';
import './Chat_room.css';
import { useSelector, useDispatch } from 'react-redux';
import { addChat } from '../Redux/Conversation';
import axios from 'axios'; // axios를 ES6 방식으로 임포트

const Chat_room = forwardRef((props, ref) => {
  const apiKey = 'sk-pUUNmJz9xyCl1vBMXDfF-onnLEi1tC_35GToThsHcYT3BlbkFJSwuYFOjAedSHcqWVwZbHBvKY0VNPQiuLp5MXQz0pwA'; // OpenAI에서 발급받은 API 키
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const nowConversation = useSelector((state) => state.Conversation);
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    async getGPTResponse(message) {
      let msg = [{ role: 'system', content: 'You are a helpful assistant.' }, ...nowConversation.memory, { role: 'user', content: message }];
      try {
        const response = await axios.post(
          apiUrl,
          {
            model: 'gpt-4', // 또는 'gpt-3.5-turbo'
            messages: msg,
            max_tokens: 150, // 응답 길이 제한
            temperature: 0.7, // 창의성 조절 (0 ~ 1 사이 값)
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        dispatch(addChat({ role: 'user', content: message }));
        dispatch(addChat({ role: 'assistant', content: response.data.choices[0].message.content }));
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
      }
    },
  }));

  useEffect(() => {
    console.log(nowConversation.memory);
    if (nowConversation.memory.length > 0 && nowConversation.memory[nowConversation.memory.length - 1].role == 'assistant') {
      console.log(nowConversation.memory[nowConversation.memory.length - 1].content);
    }
  }, [nowConversation]);

  return <div id="Chat_room_back"></div>;
});

export default Chat_room;
