import React, { forwardRef, useState, useEffect, useRef, useMemo } from 'react';
import './Chat_room.css';
import { useSelector, useDispatch } from 'react-redux';
import { addChat } from '../Redux/Conversation';
import ChatBubble from './Chat_bubble';
import { CallService } from '../Modules';

const Chat_room = forwardRef((props, ref) => {
  const chatRef = useRef(null);
  const [wholeConversation, setWholeConversation] = useState([]);

  const Answer = async () => {
    const count = wholeConversation.length > 10 ? wholeConversation.length - 10 : 0;

    const context = wholeConversation.slice(count, wholeConversation.length);
    const response = await CallService(context);
    setWholeConversation((prev) => [...prev, response]);
  };

  useEffect(() => {
    if (props.user_Chat.content != '') {
      setWholeConversation((prev) => [...prev, { role: props.user_Chat.role, content: props.user_Chat.content }]);
    }
  }, [props.user_Chat]);

  useEffect(() => {
    //마지막으로 추가된게 유저 질문이어야 시행한다.
    if (wholeConversation.length > 0 && wholeConversation[wholeConversation.length - 1].role == 'user') {
      Answer();
      props.setWaitAnswer(true);
    } else {
      props.setWaitAnswer(false);
    }
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [wholeConversation.length]);

  return (
    <div id="Chat_room_back" ref={chatRef}>
      {/* {<ChatBubble role={'user'} message={'내용내용'} />}
      {<ChatBubble role={'assistant'} message={'"헬로 월드" 프로그램은 프로그래밍 언어를 배우는 데 있어 기본적인 예제입니다. 아래는 다양한 프로그래밍 언어로 작성된 "헬로 월드" 코드입니다. ### 1. Python ```python print("Hello, World!") ``` ### 2. Java ```java public class HelloWorld { public static void main(String[] args) { System.out.println("Hello, World!"); } } ``` ### 3. C ```c #include <stdio.h> int main() { printf("Hello, World!\n"); return 0; } ``` ### 4. JavaScript ```javascript console.log("Hello, World!"); ``` ### 5. C++ ```cpp #include <iostream> int main() { std::cout << "Hello, World!" << std::endl; return 0; } ``` ### 6. Ruby ```ruby puts "Hello, World!" ``` ### 7. Go ```go package main import "fmt" func main() { fmt.Println("Hello, World!") } ``` ### 8. Swift ```swift print("Hello, World!") ``` 원하는 프로그래밍 언어가 있다면 더 구체적인 예제를 제공할 수 있습니다. 어떤 언어를 원하시나요?'} />} */}

      {wholeConversation.length > 0 ? (
        wholeConversation.map((chat, index) => <ChatBubble key={index} role={chat.role} message={chat.content} />)
      ) : (
        <div></div> // 메시지가 없을 때 보여줄 내용
      )}
    </div>
  );
});

export default React.memo(Chat_room);
