import axios from 'axios';

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
