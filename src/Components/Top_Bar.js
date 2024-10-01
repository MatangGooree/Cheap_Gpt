import React, { useState, useEffect, useRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import './Top_Bar.css';
import List_btn_icon from '../Sources/list_icon_main.svg';
import Write_btn_icon from '../Sources/write_icon.svg';
import { useSelector, useDispatch } from 'react-redux';
import { setIsListOpen } from '../Ui';
import { DropdownMenu } from 'react-bootstrap';

function Top_Bar() {
  const dispatch = useDispatch();

  const isListOpen = useSelector((state) => state.UI.isOpen);

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
       <Dropdown >
            <Dropdown.Toggle id="dropdown_top">
                드롭다운
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">항목 1</Dropdown.Item>
                <Dropdown.Item href="#/action-2">항목 2</Dropdown.Item>
                <Dropdown.Item href="#/action-3">항목 3</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    </div>
  );
}

export default Top_Bar;
