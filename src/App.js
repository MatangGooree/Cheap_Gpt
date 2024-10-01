import React, { useState, useEffect, useRef } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import './App_test.css';
import List from './Components/List';
import Chat from './Components/Chat';
function App() {

  const activeOn = (event) => {
    event.currentTarget.id = 'conversation_list_active';
  };

  const activeOff = (event) => {
    event.currentTarget.id = 'conversation_list';
  };


  return (
    <div id="Back">
      <List />
      <Chat />

      {/* // <div id="Back">
    //   <Col id="List_Panel" >
    //     <List />
    //   </Col>
    //   <Col id="Main_panel" >
    //     <Row id="Chat_Panel">
    //       <Chat/>
    //     </Row>
    //   </Col> */}

      {/* <Row id="Top_bar">
        <Top_bar />
      </Row>
      <Row id="Main_panel">
        <Col id="List_Panel">
          <List />
        </Col>
        <Col id="Chat_Panel">
          <Chat />
        </Col>
      </Row> */}
    </div>
  );
}

export default App;
