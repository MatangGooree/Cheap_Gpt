import React, { useState, useEffect, useRef } from 'react';
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

    </div>
  );
}

export default App;
