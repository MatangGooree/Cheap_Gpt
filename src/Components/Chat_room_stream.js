import React, { forwardRef, useState, useEffect, useRef, useMemo } from 'react';
import './Chat_room.css';
import { useSelector, useDispatch } from 'react-redux';
import ChatBubble from './Chat_bubble';

const Chat_room = forwardRef((props, ref) => {
  const chatRef = useRef(null);
  const [wholeConversation, setWholeConversation] = useState(JSON.parse(sessionStorage.getItem('conversation')) == null ? [] : JSON.parse(sessionStorage.getItem('conversation')));

  const [stream,setStream] = useState('');

  const isListOpen = useSelector((state) => state.UI.isOpen);

  const Answer = () => {
    let max = 10;

    if (sessionStorage.getItem('max') == null) {
      sessionStorage.setItem('max', 10);
    } else {
      max = sessionStorage.getItem('max');
    }

    const count = wholeConversation.length > max ? wholeConversation.length - max : 0;

    const context = wholeConversation.slice(count, wholeConversation.length);

    let assistant_ref = 'You are a helpful assistant.';

    if (sessionStorage.getItem('custom') == null) {
      sessionStorage.setItem('custom', 'You are a helpful assistant.');
    } else {
      assistant_ref = sessionStorage.getItem('custom');
    }

    fetch('/callGptAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ custom: assistant_ref, conversation: context, model: sessionStorage.getItem('model') }),
    }).then((response) => {

      setWholeConversation((prev) => [...prev, { role: 'assistant', content:'' }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      reader.read().then(function processText({ done, value }) {
        if (done) {
          console.log('Stream complete');
          return;
        }

        
        // 스트리밍된 데이터를 디코딩해서 실시간으로 처리
        const chunk = decoder.decode(value, { stream: true });
        console.log(chunk);

        setStream(chunk);


        // 다시 읽기
        reader.read().then(processText);
      });
    });
  };

  useEffect(() => {
    if (props.user_Chat.content != '') {
      setWholeConversation((prev) => [...prev, { role: 'user', content: props.user_Chat.content }]);
    }  
   }, [props.user_Chat]);

  useEffect(() => {
    //마지막으로 추가된게 유저 질문이어야 시행한다.
    if (wholeConversation.length > 0 && wholeConversation[wholeConversation.length - 1].role == 'user') {
      Answer();
      props.setWaitAnswer(true);
    } else {
      // props.setWaitAnswer(false);
    }
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth',
    });

    sessionStorage.setItem('conversation', JSON.stringify(wholeConversation));
  }, [wholeConversation.length]);

  return (
    <div className={isListOpen ? 'Chat_room_back list_opened' : 'Chat_room_back'} ref={chatRef}>
      {wholeConversation.length > 0 ? (
        wholeConversation.map((chat, index) => <ChatBubble_stream key={`${index}-bubble`} role={chat.role} message={chat.content} stream ={stream} index={index} />)
      ) : (
        <div></div> // 메시지가 없을 때 보여줄 내용
      )}
    </div>


  );
});

export default React.memo(Chat_room);
