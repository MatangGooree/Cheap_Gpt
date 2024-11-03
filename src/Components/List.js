import React from 'react-bootstrap';
import { Container, Col, ListGroup } from 'react-bootstrap';
import './List.css';
import List_btn_icon from '../Sources/Close.svg';
import Write_btn_icon from '../Sources/new.svg';
import { useSelector, useDispatch } from 'react-redux';
import { setIsListOpen } from '../Redux/Ui';
import { LoadConversation } from '../Modules';
function List() {
  const dispatch = useDispatch();

  const List = useSelector((state) => state.Conv_List.list);

  async function handleLoadConv(id) {
    console.log(id);
    LoadConversation(id);
  }

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
          {List.length > 0
            ? List.map((conv, index) => (
                <li id="conversation_list" className="list-group-item" onClick={()=>handleLoadConv(conv.conversation_id)} onMouseOver={activeOn} onMouseLeave={activeOff}>
                  {conv.subject}
                </li>
              ))
            : ''}
        </ul>
      </div>
    </div>
  );
}

export default List;
