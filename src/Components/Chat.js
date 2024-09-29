import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

function Chat() {
  const [inputVal, setInputVal] = useState('');
  const [isInput, setIsInput] = useState(false);
  const inputRef = useRef(null);
  const groupRef = useRef(null);

  const input_change = (event) => {
    event.target.style.height = '37px'; // 높이 초기화
    groupRef.current.style.height = `57px`;

    event.target.style.height = `${event.target.scrollHeight}px`; // 높이를 콘텐츠에 맞춰 조정
    groupRef.current.style.height = `${event.target.scrollHeight + 20}px`;

    const val = event.target.value;
    setInputVal(val);
  };

  useEffect(() => {
    if (inputVal.length > 0) {
      if (!isInput) {
        setIsInput(true);
      }
    } else {
      setIsInput(false);
    }
  }, [inputVal]);

  return (
    <div id="Chat_back">
      {' '}
      <div id="Ask_group" ref={groupRef}>
        <textarea id="tb_input" onInput={input_change} />
        <button id="input_button" ref={inputRef} style={isInput ? { backgroundColor: 'white', color: 'black' } : {}}>
          ⇧
        </button>
      </div>
    </div>
  );
}

export default Chat;
