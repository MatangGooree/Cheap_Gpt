import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import Top_bar from './Top_Bar';
import Chat_room from './Chat_room';
import { useSelector, useDispatch } from 'react-redux';

import InputIcon from '../Sources/arrow-thin-up-svgrepo-com.svg';

function Chat() {
  const [inputVal, setInputVal] = useState('');
  const [isInput, setIsInput] = useState(false);
  const groupRef = useRef(null);
  const inputRef = useRef(null);
  const chatRoomRef = useRef(null);

  const isListOpen = useSelector((state) => state.UI.isOpen);

  const [user_chat, setUser_Chat] = useState({ role: 'user', content: '' });
  const [waitAnswer, setWaitAnswer] = useState(false);

  const input_change = (event) => {
    setInputVal(inputRef.current.value);
  };

  const EnterInput = () => {
    if (inputVal.trim() === '') {
      return; // 입력값이 비어있는 경우 아무것도 하지 않음
    }
    setUser_Chat({ role: 'user', content: inputVal });

    setWaitAnswer(true);
  };

  const EnterKeyDown = (event) => {
    if (event.key == 'Enter' && !waitAnswer) {
      event.preventDefault();
      EnterInput();
      setInputVal('');
    }
  };

  useEffect(() => {
    inputRef.current.style.height = '37px'; // 높이 초기화
    groupRef.current.style.height = `57px`;
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; // 높이를 콘텐츠에 맞춰 조정
    groupRef.current.style.height = `${groupRef.current.scrollHeight + 20}px`;

    if (inputVal.length > 0) {
      if (!isInput) {
        setIsInput(true);
      }
    } else {
      setIsInput(false);
    }
  }, [inputVal]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div id="Chat_back" className={isListOpen ? '' : 'expanded'}>
      <Top_bar />
      <Chat_room ref={chatRoomRef} user_Chat={user_chat} waitAnswer={waitAnswer} setWaitAnswer={setWaitAnswer} />
      <div id="Ask_group" ref={groupRef}>
        <textarea id="tb_input" ref={inputRef} onInput={input_change} onKeyPress={EnterKeyDown} value={inputVal} />
        <button id="input_button" className={isInput && !waitAnswer ? 'hoverOn' : ''} onClick={EnterInput} disabled={isInput && !waitAnswer ? false : true} style={isInput && !waitAnswer ? { backgroundColor: 'white', color: 'black' } : {}}>
          <img src={InputIcon} />
        </button>
      </div>
    </div>
  );
}

export default Chat;
