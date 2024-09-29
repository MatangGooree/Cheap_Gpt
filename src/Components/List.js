import React from 'react-bootstrap';
import { Container, Col, ListGroup } from 'react-bootstrap';
import './List.css';

function List() {
  const activeOn = (event) => {
    event.currentTarget.id = "conversation_list_active"
  };

  const activeOff = (event) => {
    event.currentTarget.id = "conversation_list"
  };

  return (
        <div>
          <ul className="list-group">
            <li id="conversation_list" className="list-group-item" onMouseOver={activeOn} onMouseLeave={activeOff}>
              An active item
            </li>
            <li id="conversation_list" className="list-group-item" onMouseOver={activeOn} onMouseLeave={activeOff}>
              A third item
            </li>
            <li id="conversation_list" className="list-group-item" onMouseOver={activeOn} onMouseLeave={activeOff}>
              And a fifth one
            </li>
            <li id="conversation_list" className="list-group-item" onMouseOver={activeOn} onMouseLeave={activeOff}>
              A fourth item
            </li>
          </ul>
        </div>
  );
}

export default List;
