import React, { useState, useEffect, useRef } from 'react';
import './Top_Bar.css';

import List_btn_icon from '../Sources/list_icon_main.svg'

function Top_Bar({setIsListOpen}) {

  const setListPanel=()=>{
    setIsListOpen(true)
  };

  return (
    <div id='Top_bar'>
      <button id='list_btn_main' onClick={setListPanel}><img src={List_btn_icon} alt="" /></button>
    </div>
  );
}

export default Top_Bar;
