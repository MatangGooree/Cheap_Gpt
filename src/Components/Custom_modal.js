import { Modal, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

//#region 스타일 컴포넌트
const Styled_button = styled.button`
  background-color: #2f2f2f;
  color: white;
  padding-left: 10px;
  padding-right: 10px;
  border: none;
  border-radius: 10px;
  width: fit-content;
  height: 40px;
  margin: 0px;
  &:hover {
    background-color: #565656;
  }
`;
const Styled_button_close = styled(Styled_button)`
  margin-left: auto;
  border-radius: 30%;
  width: 40px;
  height: 40px;
`;

const Styled_label = styled.label`
  margin-right: 10px;
  white-space: nowrap;
`;

const Styled_div = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

//#endregion
function Custom_modal(props) {
  const [maxVal, setMaxVal] = useState(sessionStorage.getItem('max') == null ? 10 : sessionStorage.getItem('max'));
  const [custom, setCustom] = useState(sessionStorage.getItem('custom') == null ? '' : sessionStorage.getItem('custom'));

  const handle_max = (e) => {
    setMaxVal(e.target.value); // 입력된 값을 상태로 업데이트
  };

  const handle_custom = (e) => {
    setCustom(e.target.value);
  };

  const Save_settings = () => {
    const custom = document.getElementById('custom_text').value;
    sessionStorage.setItem('max', maxVal);
    sessionStorage.setItem('custom', custom);

    props.handleClose();
  };

  return (
    <Modal size="lg" show={props.show} onHide={props.handleClose}>
      <div className="modal_back">
        <Modal.Header
          className="modal_header"
          style={{
            display: 'flex',
            flexDirection: 'row',
            borderBottom: 'none',
          }}
        >
          <Modal.Title>맞춤 설정</Modal.Title>
          <Styled_button_close onClick={props.handleClose}>X</Styled_button_close>
        </Modal.Header>
        <Modal.Body style={{ padding: '35px', paddingBottom: '20px' }}>
          <Styled_div>
            <Styled_label htmlFor="">대화 기억</Styled_label>
            <input type="number" step={10} max={40} min={0} value={maxVal} onChange={(e) => handle_max(e)} style={{ outline: 'none', border: 'none', borderRadius: '5px' }} />
          </Styled_div>
          <Styled_div>
            <Styled_label htmlFor="">맞춤 설정</Styled_label>
            <textarea
              id="custom_text"
              type="text"
              value={custom}
              onChange={handle_custom}
              style={{ resize: 'none', width: '100%', height: '250px', border: 'none', borderRadius: '5px', outline: 'none' }}
            />
          </Styled_div>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: 'none', padding: '35px', paddingTop: '0px' }}>
          <Styled_button onClick={Save_settings}>저장</Styled_button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default Custom_modal;
