import React, { useState, useEffect, useRef } from 'react';
import './Chat_bubble.css';
import { useSelector, useDispatch } from 'react-redux';

function Chat_Bubble(props) {
  return (
    <div class={props.role === 'user' ? 'chat_bubble user' : 'chat_bubble'}>
      <div class={props.role === 'user' ? 'bubble userbub' : 'bubble'}>
        {props.message}
        </div>
    </div>
  );
}

export default Chat_Bubble;
