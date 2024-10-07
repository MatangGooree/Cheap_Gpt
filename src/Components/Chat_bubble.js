import React, { useState, useEffect, useRef } from 'react';
import './Chat_bubble.css';
import { useSelector, useDispatch } from 'react-redux';
import gptIcon from '../Sources/answer.svg';
import { Classifier } from '../Modules';

function Chat_Bubble(props) {
  return (
    <div className={props.role === 'user' ? 'chat_bubble user' : 'chat_bubble'}>
      {props.role === 'user' ? '' : <img className="chat_icon" src={gptIcon} alt="" />}
      <div className={props.role === 'user' ? 'bubble userbub' : 'bubble'}>{Classifier(props)}</div>
    </div>
  );
}

export default Chat_Bubble;
