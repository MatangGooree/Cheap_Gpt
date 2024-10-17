import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedDark, solarizedLight, monokai, vsDark, dracula, atomOneDark, atomOneLight, twilight, materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
const langList = ['python', 'java', 'csharp','c', 'c++', 'javascript', 'ruby', 'go', 'php', 'swift', 'kotlin', 'c#', 'rust', 'typescript', 'shell', 'r', 'scala', 'perl', 'dart', 'elixir', 'lua', 'matlab', 'haskell', 'objective-c', 'visual basic .net', 'sql', 'groovy'];

export function Classifier(props) {
  if (props.role == 'user') {
    return <pre className="text">{props.message}</pre>;
  } else {
    const parts = props.message.split(/(```[\s\S]*?```)/g); // 백틱으로 감싸진 부분을 추출
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // 코드 블록인 경우
        const full = part.replaceAll('```', '').split('\n'); // 백틱 제거
        const lang = full[0].trim().toLowerCase();
        if (langList.includes(lang)) {
          full.shift();
        }
        const code = full.join('\n');
        return (
          <div className="codes_back" key={`${index}-code`}>
            <h1 className="code_top">{lang}</h1>
            <SyntaxHighlighter language={lang} style={dracula} className="codes">
              {code}
            </SyntaxHighlighter>
          </div>
        );
      } else {
        const texts = part.split(/(\*\*[\s\S]*?\*\*|`[^`]+`|###.*?\n)/g);
        return (
          <pre key={`${index}-text`} className="text">
            {texts.map((str, index) => {
              if (str.startsWith('**') && str.endsWith('**')) {
                return (
                  <span className="strong" key={`${index}-strong`}>
                    {str.slice(2, -2)}
                  </span>
                ); // **를 제거하고 강조 표시
              } else if (str.startsWith('`') && str.endsWith('`')) {
                return (
                  <span className="inlineCode" key={`${index}-inline`}>
                    {str.slice(1, -1).trim()}
                  </span>
                );
              } else if (str.startsWith('###') && str.endsWith('\n')) {
                return (
                  <h1 className="h1" key={`${index}-h1`}>
                    {str.slice(3).trim()}
                  </h1>
                );
              } else {
                return <span key={`${index}-span`}>{str}</span>; // 일반 문자열을 span으로 감싸서 출력
              }
            })}
          </pre>
        );
      }
    });
  }
}

export function GetAnswer(streamChunk) {
  const wholeConversation = JSON.parse(sessionStorage.getItem('conversation')) == null ? [] : JSON.parse(sessionStorage.getItem('conversation'));

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
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    reader.read().then(function processText({ done, value }) {
      if (done) {
        if (streamChunk) {
          streamChunk('', done);
        }
        return;
      }

      // 스트리밍된 데이터를 디코딩해서 실시간으로 처리
      const chunk = decoder.decode(value, { stream: true });

      if (streamChunk) {
        streamChunk(chunk, done);
      }

      // 다시 읽기
      reader.read().then(processText);
    });
  });
}
