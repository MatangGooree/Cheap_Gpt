import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import Top_bar from './Top_Bar';
import Chat_room from './Chat_room';
import { useSelector, useDispatch } from 'react-redux';

import InputIcon from '../Sources/arrow-thin-up-svgrepo-com.svg'

function Chat() {
  const [inputVal, setInputVal] = useState('');
  const [isInput, setIsInput] = useState(false);
  const groupRef = useRef(null);
  const chatRoomRef = useRef(null);

  const isListOpen = useSelector((state) => state.UI.isOpen);



  const input_change = (event) => {
    event.target.style.height = '37px'; // 높이 초기화
    groupRef.current.style.height = `57px`;

    event.target.style.height = `${event.target.scrollHeight}px`; // 높이를 콘텐츠에 맞춰 조정
    groupRef.current.style.height = `${event.target.scrollHeight + 20}px`;

    const val = event.target.value;
    setInputVal(val);
  };

  const EnterInput=()=>{
    chatRoomRef.current.getGPTResponse(inputVal);
  }



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
    <div id="Chat_back" class={isListOpen?'':'expanded'}>
      <Top_bar/>
      <Chat_room ref={chatRoomRef}/>
      <div id="Ask_group" ref={groupRef}>
        <textarea id="tb_input" onInput={input_change} />
        <button  id="input_button" class={isInput?'hoverOn':''} onClick={EnterInput}  disabled={isInput?false:true}  style={isInput ? { backgroundColor: 'white', color: 'black' } : {}}>
          <img src={InputIcon} />
        </button>
      </div>
    </div>
  );
}

export default Chat;
