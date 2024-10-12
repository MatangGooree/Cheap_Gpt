import React, { useState, useEffect, useRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import './Top_Bar.css';
import Open_list_icon from '../Sources/Open.svg';
import Close_list_icon from '../Sources/Close.svg';
import Check_icon from '../Sources/check.svg';
import Plus_icon from '../Sources/new.svg';
import { useSelector, useDispatch } from 'react-redux';
import { setIsListOpen } from '../Redux/Ui';
import { DropdownDivider, DropdownMenu } from 'react-bootstrap';
import Custom_modal from './Custom_modal';

function Top_Bar() {
  const dispatch = useDispatch();

  const isListOpen = useSelector((state) => state.UI.isOpen);

  const [show, setShow] = useState(false);
  let sess_model = sessionStorage.getItem('model') == null ? '' : sessionStorage.getItem('model');
  const [model, setModel] = useState('GPT-4o mini');

  const [models, setModels] = useState(['GPT-4o mini', 'GPT-4o', 'GPT-3.5 Turbo']);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    sessionStorage.setItem('model', model);
  }, [model]);

  return (
    <div id="Top_bar">
      {isListOpen ? (
        //   <button id="list_btn_chat" onClick={() => dispatch(setIsListOpen())}>
        //   <img src={Close_list_icon} alt="" />
        // </button>
        ''
      ) : (
        <div>
          <button id="list_btn_chat" onClick={() => dispatch(setIsListOpen())}>
            <img src={Open_list_icon} alt="" />
          </button>
          <button id="write_btn_chat">
            <img src={Plus_icon} alt="" />
          </button>
        </div>
      )}
      <Dropdown id="model_dropdown">
        <Dropdown.Toggle id="dropdown_top">{model}</Dropdown.Toggle>

        <Dropdown.Menu className="dropdown_menu">
          {models.map((item, index) => (
            <div key={`${index}-model`} className="dropdown_item" onClick={() => setModel(item)}>
              {item}
              {model == item ? <img src={Check_icon} /> : ''}
            </div>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown id="settings_dropdown">
        <Dropdown.Toggle id="dropdown_top" style={{ borderRadius: '50%' }}>
          <img src={Open_list_icon} alt="" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown_menu">
          <div className="dropdown_item" onClick={handleShow}>
            맞춤 설정
          </div>
          <div className="dropdown_item">로그인</div>
        </Dropdown.Menu>
      </Dropdown>

      {/* 모달 */}
      <Custom_modal show={show} handleClose={handleClose} handleShow={handleShow} />
    </div>
  );
}

export default Top_Bar;
