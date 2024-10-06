import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedDark, solarizedLight, monokai, vsDark, dracula, atomOneDark, atomOneLight, twilight, materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const apiKey = process.env.REACT_APP_OPENAI_API_KEY; // OpenAI에서 발급받은 API 키
const apiUrl = 'https://api.openai.com/v1/chat/completions';

export async function CallService(messages) {
  let msg = [{ role: 'system', content: 'You are a helpful assistant.' }, ...messages];
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-4o-mini', // 또는 'gpt-3.5-turbo'
        messages: msg,
        max_tokens: 1000, // 응답 길이 제한
        temperature: 0.7, // 창의성 조절 (0 ~ 1 사이 값)
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return { role: 'assistant', content: response.data.choices[0].message.content };
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return { role: 'assistant', content: error.response ? error.response.data : error.message };
  }
}

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
          <div className="codes_back">
            <h3 className="code_top">{lang}</h3>
            <SyntaxHighlighter key={index} language={lang} style={dracula} className="codes">
              {code.trim()}
            </SyntaxHighlighter>
          </div>
        );
      } else {
        const texts = part.split(/(\*\*[\s\S]*?\*\*|`[^`]+`|###.*?\n)/g);
        return (
          <pre key={index} className="text">
            {texts.map((str, index) => {
              if (str.startsWith('**') && str.endsWith('**')) {
                return (
                  <span className="strong" key={index}>
                    {str.slice(2, -2)}
                  </span>
                ); // **를 제거하고 강조 표시
              } else if (str.startsWith('`') && str.endsWith('`')) {
                return (
                  <span className="inlineCode" key={index}>
                    {str.slice(1, -1).trim()}
                  </span>
                );
              } else if (str.startsWith('###') && str.endsWith('\n')) {
                return (
                  <h1 className="h1" key={index}>
                    {str.slice(3).trim()}
                  </h1>
                );
              } else {
                return <span key={index}>{str}</span>; // 일반 문자열을 span으로 감싸서 출력
              }
            })}
          </pre>
        );
      }
    });
  }
}
