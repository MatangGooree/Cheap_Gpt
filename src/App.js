import React,{useState,useEffect,useRef} from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import './App_test.css';
import List from './Components/List';
import Chat from './Components/Chat';
function App() {

  const [isListOpen,setIsListOpen] = useState(false);

  const activeOn = (event) => {
    event.currentTarget.id = 'conversation_list_active';
  };

  const activeOff = (event) => {
    event.currentTarget.id = 'conversation_list';
  };

  
  useEffect(()=>{
    console.log(isListOpen);
    if(isListOpen){
      
      
      
    }else{
    // var MainPanel  = document.getElementById("Main_panel");
    // MainPanel.style.left="0px";
    // MainPanel.style.width = "100vw";
  }
},[isListOpen])

  return (
    <div id="Back">
      <Col id="List_Panel">
        <List setIsListOpen={setIsListOpen} />
      </Col>
      <Col id="Main_panel">
        <Row id="Chat_Panel">
          <Chat setIsListOpen={setIsListOpen}/>
        </Row>
      </Col>

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
