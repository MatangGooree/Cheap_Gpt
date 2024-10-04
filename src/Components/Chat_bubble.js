import React, { useState, useEffect, useRef } from 'react';
import './Chat_bubble.css';
import { useSelector, useDispatch } from 'react-redux';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedDark, solarizedLight, monokai, vsDark, dracula, atomOneDark, atomOneLight, twilight, materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import gptIcon from '../Sources/list_icon.svg';

function Chat_Bubble(props) {
  const parseMessage = (message) => {
    if (props.role == 'user') {
      return <pre className="text">{props.message}</pre>;
    } else {
      const parts = message.split(/(```[\s\S]*?```)/g); // 백틱으로 감싸진 부분을 추출
      return parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // 코드 블록인 경우
          const full = part.replaceAll('```', '').split('\n'); // 백틱 제거
          const lang = full[0];
          full.shift(0);
          const code = full.join('\n');
          return (
            <div className="codes_back">
              <h3 className="code_top">{lang}</h3>
              <SyntaxHighlighter key={index} language={lang} style={dracula} className="codes">
                {code.trim()}
              </SyntaxHighlighter>
            </div>
          );
        } else {
          const texts = part.split(/(\*\*[\s\S]*?\*\*|`[^`]+`)/g);

          return (
            <pre key={index} className="text">
              {texts.map((str, index) => {
                if (str.startsWith('**') && str.endsWith('**')) {
                  return (
                    <span className="strong" key={index}>
                      {str.slice(2, -2)}
                    </span>
                  ); // **를 제거하고 강조 표시
                }else if(str.startsWith('`') && str.endsWith('`')){
                  return (
                    <span className="inlineCode" key={index}>
                      {str.slice(1, -1)}
                    </span>
                  );
                } 
                else {
                  return <span key={index}>{str}</span>; // 일반 문자열을 span으로 감싸서 출력
                }
              })}
            </pre>
          );

          // return (
          //   <pre key={index} className="text">
          //     {part}
          //   </pre>
          // );
        }
      });
    }
  };

  useEffect(() => {}, [props.message]);
  return (
    <div className={props.role === 'user' ? 'chat_bubble user' : 'chat_bubble'}>
      {/* {props.role === 'user' ? '' : <img className="chat_icon" src={gptIcon} alt="" />} */}
      <div className={props.role === 'user' ? 'bubble userbub' : 'bubble'}>{parseMessage(props.message)}</div>
      {/* {props.role === 'user' ? <img className="user_chat_icon" src={gptIcon} alt="" /> : ''} */}
    </div>
  );
}

export default Chat_Bubble;
