import React, { useState, useEffect, useRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import './Top_Bar.css';
import List_btn_icon from '../Sources/list_icon_main.svg';
import Write_btn_icon from '../Sources/write_icon.svg';
import { useSelector, useDispatch } from 'react-redux';
import { setIsListOpen } from '../Redux/Ui';
import { DropdownDivider, DropdownMenu } from 'react-bootstrap';
import Custom_modal from './Custom_modal';

function Top_Bar() {
  const dispatch = useDispatch();

  const isListOpen = useSelector((state) => state.UI.isOpen);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow =()=>setShow(true);

  return (
    <div id="Top_bar">
      {isListOpen ? (
        ''
      ) : (
        <div>
          <button id="list_btn_chat" onClick={() => dispatch(setIsListOpen())}>
            <img src={List_btn_icon} alt="" />
          </button>
          <button id="write_btn_chat">
            <img src={Write_btn_icon} alt="" />
          </button>
        </div>
      )}
      <Dropdown id="model_dropdown">
        <Dropdown.Toggle id="dropdown_top">드롭다운</Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">항목 1</Dropdown.Item>
          <Dropdown.Item href="#/action-2">항목 2</Dropdown.Item>
          <Dropdown.Item href="#/action-3">항목 3</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown id="settings_dropdown">
        <Dropdown.Toggle id="dropdown_top">
          <img src={List_btn_icon} alt="" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={handleShow}>맞춤 설정</Dropdown.Item>
   <DropdownDivider/>
          <Dropdown.Item href="#/action-3">로그인</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

{/* 모달 */}
      <Custom_modal show ={show} handleClose={handleClose} handleShow={handleShow}/>
    </div>
  );
}

export default Top_Bar;
