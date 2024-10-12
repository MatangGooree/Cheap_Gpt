import React, { useState, useEffect, useRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import './Top_Bar.css';
import Open_list_icon from '../Sources/Open.svg';
import Close_list_icon from '../Sources/Close.svg';
import Check_icon from '../Sources/check.svg';
import Plus_icon from '../Sources/new.svg';
import Setting_icon from '../Sources/Setting.svg';

import { useSelector, useDispatch } from 'react-redux';
import { setIsListOpen } from '../Redux/Ui';
import { DropdownDivider, DropdownMenu } from 'react-bootstrap';
import Custom_modal from './Custom_modal';
import { jwtDecode } from 'jwt-decode';

function Top_Bar() {
  const dispatch = useDispatch();

  const isListOpen = useSelector((state) => state.UI.isOpen);

  const [show, setShow] = useState(false);
  let sess_model = sessionStorage.getItem('model') == null ? 'GPT-4o mini' : sessionStorage.getItem('model');
  const [model, setModel] = useState(sess_model);

  const [models, setModels] = useState(['GPT-4o mini', 'GPT-4o', 'GPT-3.5 Turbo']);

  const [profileImg, setProfileImg] = useState(Open_list_icon);

  const [jwt, setJwt] = useState(sessionStorage.getItem('jwt')); // JWT를 상태로 관리

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogin = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=254976605878-1bhh5msadip435j094psc9vg9jmp8a7u.apps.googleusercontent.com&redirect_uri=http://localhost:5000/logIn_Load&response_type=code&scope=profile email`;
  };
  const handleLogout = () => {
    sessionStorage.removeItem('jwt');
    setJwt(null);
  };

  useEffect(() => {
    sessionStorage.setItem('model', model);
  }, [model]);

  useEffect(() => {
    if (jwt == null) {
      setProfileImg(Setting_icon);
      sessionStorage.removeItem('userInfo');
      setModels(['GPT-4o mini']);
      return;
    }

    setModels(['GPT-4o mini', 'GPT-4o', 'GPT-3.5 Turbo']);

    const decoded = jwtDecode(jwt);
    sessionStorage.setItem('userInfo', JSON.stringify({ Nickname: decoded.user.name, profile_picture: decoded.user.picture }));
    setProfileImg(JSON.parse(sessionStorage.getItem('userInfo')).profile_picture);
  }, [jwt]);

  return (
    <div id="Top_bar">
      {isListOpen ? (
        //   <button id="list_btn_chat" onClick={() => dispatch(setIsListOpen())}>
        //   <img src={Close_list_icon} alt="" />
        // </button>
        ''
      ) : (
        <div>
          <button id="list_btn_chat" onClick={() => dispatch(setIsListOpen())}>
            <img src={Open_list_icon} alt="" />
          </button>
          <button id="write_btn_chat">
            <img src={Plus_icon} alt="" />
          </button>
        </div>
      )}
      <Dropdown id="model_dropdown">
        <Dropdown.Toggle id="dropdown_top">{model}</Dropdown.Toggle>

        <Dropdown.Menu className="dropdown_menu">
          {models.map((item, index) => (
            <div key={`${index}-model`} className="dropdown_item" onClick={() => setModel(item)}>
              {item}
              {model == item ? <img src={Check_icon} /> : ''}
            </div>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown id="settings_dropdown">
        <Dropdown.Toggle id="dropdown_top_setting">
          <img id="profile_img" src={profileImg} alt="" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown_menu">
          <div className="dropdown_item" onClick={handleShow}>
            맞춤 설정
          </div>
          {sessionStorage.getItem('jwt') == null ? (
            <div className="dropdown_item" onClick={handleLogin}>
              로그인
            </div>
          ) : (
            <div className="dropdown_item" onClick={handleLogout}>
              로그아웃
            </div>
          )}
        </Dropdown.Menu>
      </Dropdown>

      {/* 모달 */}
      <Custom_modal show={show} handleClose={handleClose} handleShow={handleShow} />
    </div>
  );
}

export default Top_Bar;
