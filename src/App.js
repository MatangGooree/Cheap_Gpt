import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import List from './Components/List';
import Chat from './Components/Chat';
import { Routes, Route, Link, BrowserRouter } from 'react-router-dom';
function App() {


  return (
    <div id="Back">
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Chat />
              <List />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
