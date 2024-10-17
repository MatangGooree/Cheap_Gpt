import React, { forwardRef, useState, useEffect, useRef, useMemo } from 'react';
import './Chat_room.css';
import { useSelector, useDispatch } from 'react-redux';
import ChatBubble from './Chat_bubble';

const Chat_room = forwardRef((props, ref) => {
  const chatRef = useRef(null);
  const isListOpen = useSelector((state) => state.UI.isOpen);

  const [wholeConversation, setWholeConversation] = useState(JSON.parse(sessionStorage.getItem('conversation')) == null ? [] : JSON.parse(sessionStorage.getItem('conversation')));

  useEffect(() => {
    if (props.user_Chat.content != '') {
      setWholeConversation((prev) => [...prev, { role: props.user_Chat.role, content: props.user_Chat.content }]);
    }
  }, [props.user_Chat]);

  useEffect(() => {
    //마지막으로 추가된게 유저 질문이어야 시행한다.

    if (wholeConversation.length == 0) {
      return;
    }

    if (wholeConversation[wholeConversation.length - 1].role == 'user') {
      sessionStorage.setItem('conversation', JSON.stringify(wholeConversation));

      setWholeConversation((prev) => [...prev, { role: 'assistant', content: '' }]);

      props.setWaitAnswer(true);
    } else if (wholeConversation[wholeConversation.length - 1].role == 'assistant' && wholeConversation[wholeConversation.length - 1].content != '') {
      sessionStorage.setItem('conversation', JSON.stringify(wholeConversation));
    }
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [wholeConversation]);

  return (
    <div className={isListOpen ? 'Chat_room_back list_opened' : 'Chat_room_back'} ref={chatRef}>
      {wholeConversation.length > 0 ? (
        wholeConversation.map((chat, index) => <ChatBubble key={`${index}-bubble`} role={chat.role} message={chat.content} setWaitAnswer={props.setWaitAnswer} setWholeConversation={setWholeConversation} index={index} />)
      ) : (
        <div></div> // 메시지가 없을 때 보여줄 내용
      )}
    </div>
  );
});

export default React.memo(Chat_room);
