import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedDark, solarizedLight, monokai, vsDark, dracula, atomOneDark, atomOneLight, twilight, materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function Classifier(props) {
  if (props.role == 'user') {
    return <pre className="text">{props.message}</pre>;
  } else {
    const parts = props.message.split(/(```[\s\S]*?```)/g); // 백틱으로 감싸진 부분을 추출
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // 코드 블록인 경우
        const full = part.replaceAll('```', '').split('\n'); // 백틱 제거
        const lang = full[0];
        full.shift(0);
        const code = full.join('\n');
        return (
          <div className="codes_back" key={`${index}-code`}>
            <h3 className="code_top">{lang}</h3>
            <SyntaxHighlighter language={lang} style={dracula} className="codes">
              {code.trim()}
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
