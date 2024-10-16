import React, { useState, useEffect, useRef } from 'react';
import './Chat_bubble.css';
import { useSelector, useDispatch } from 'react-redux';
import gptIcon from '../Sources/answer.svg';
import { Classifier, GetAnswer } from '../Modules';

function Chat_Bubble(props) {
  //새로 만들어졌는데 role이 어시스턴트고, 메세지가 없으면 모듈 호출?
  const [streamMsg, setStreamMsg] = useState('');

  let finalMsg = '';

  const handleChunk = (chunk, done) => {
    console.log(props);

    if (done) {
      props.setWaitAnswer(false);
      console.log(finalMsg);
      props.setWholeConversation((prev) => [...prev.slice(0, -1), { role: 'assistant', content: finalMsg }]);
    }

    setStreamMsg((prev) => prev + chunk);
    finalMsg = finalMsg + chunk;
  };

  useEffect(() => {
    if (props.role == 'assistant' && props.message == '') {
      GetAnswer(handleChunk);
    } else if (props.role == 'assistant' && props.message != '') {
      props.setWholeConversation((prev) => [...prev.slice(0, -1), { role: 'assistant', content: props.message }]);
      setStreamMsg(props.message);
    }
  }, []);

  return (
    <div className={props.role === 'user' ? 'chat_bubble user' : 'chat_bubble'}>
      {props.role === 'user' ? '' : <img className="chat_icon" src={gptIcon} alt="" />}
      {/* <div className={props.role === 'user' ? 'bubble userbub' : 'bubble'}>{Classifier(props)}</div>  */}
      <div className={props.role === 'user' ? 'bubble userbub' : 'bubble'}>{Classifier({ role: props.role, message: props.role == 'user' ? props.message : streamMsg })}</div>
      {/* <div className={props.role === 'user' ? 'bubble userbub' : 'bubble'}>{props.role == 'user' ? props.message : streamMsg}</div> */}
    </div>
  );
}

export default Chat_Bubble;
