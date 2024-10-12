import React from 'react-bootstrap';
import { Container, Col, ListGroup } from 'react-bootstrap';
import './List.css';
import List_btn_icon from '../Sources/Close.svg';
import Write_btn_icon from '../Sources/new.svg';
import { useSelector, useDispatch } from 'react-redux';
import { setIsListOpen } from '../Redux/Ui';
function List() {
  const dispatch = useDispatch();
  const activeOn = (event) => {
    event.currentTarget.id = 'conversation_list_active';
  };

  const activeOff = (event) => {
    event.currentTarget.id = 'conversation_list';
  };

  return (
    <div id="list_back">
      <div id="list_top">
        <button id="list_btn" onClick={() => dispatch(setIsListOpen())}>
          <img src={List_btn_icon} alt="" />
        </button>
        <button id="write_btn">
          <img src={Write_btn_icon} alt="" />
        </button>
      </div>
      <div id="list_items">
        <ul className="list-group">
          <li id="conversation_list" className="list-group-item" onMouseOver={activeOn} onMouseLeave={activeOff}>
            An active item
          </li>
          <li id="conversation_list" className="list-group-item" onMouseOver={activeOn} onMouseLeave={activeOff}>
            A third item
          </li>
        </ul>
      </div>
    </div>
  );
}

export default List;
