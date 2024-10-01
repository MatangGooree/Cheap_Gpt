import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react';
import './Chat_room.css';
import { useSelector, useDispatch } from 'react-redux';
import { addChat } from '../Redux/Conversation';
import axios from 'axios';
import ChatBubble from './Chat_bubble';

const Chat_room = forwardRef((props, ref) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY; // OpenAI에서 발급받은 API 키
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const reduxConversation = useSelector((state) => state.Conversation);
  const dispatch = useDispatch();

  const chatRef = useRef(null);
  const [nowConversation, setNowConversation] = useState([]);

  useImperativeHandle(ref, () => ({
    async getGPTResponse(message) {
      setNowConversation((prev) => [...prev, { role: 'user', content: message }]);

      let msg = [{ role: 'system', content: 'You are a helpful assistant.' }, ...reduxConversation.memory, { role: 'user', content: message }];
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

        setNowConversation((prev) => [...prev, { role: 'assistant', content: response.data.choices[0].message.content }]);

        dispatch(addChat({ role: 'user', content: message }));
        dispatch(addChat({ role: 'assistant', content: response.data.choices[0].message.content }));
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
      }
    },
  }));

  useEffect(() => {
    console.log(reduxConversation.memory);
    if (reduxConversation.memory.length > 0 && reduxConversation.memory[reduxConversation.memory.length - 1].role == 'assistant') {
      console.log(reduxConversation.memory[reduxConversation.memory.length - 1].content);
    }
  }, [reduxConversation]);

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [nowConversation]);

  return (
    <div id="Chat_room_back" ref={chatRef}>
      {nowConversation.length > 0 ? (
        nowConversation.map((chat, index) => <ChatBubble key={index} role={chat.role} message={chat.content} />)
      ) : (
        <div></div> // 메시지가 없을 때 보여줄 내용
      )}
    </div>
  );
});

export default Chat_room;
