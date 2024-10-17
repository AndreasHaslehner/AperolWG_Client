import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { signal, effect } from '@preact/signals-react'

import { getCookie, setCookie, token_signal } from './helper/cookie_handler';
import { get_stored_signal } from './storage_handler';
import { api_get } from './helper/api_handler';
import { ButtonGroup, Form, InputGroup, ToggleButton } from 'react-bootstrap';

export const loginmodal_show = signal(true);
export const client_online = signal(false);
export const client_info = get_stored_signal("client_info");

const form_response = signal();
const isRegister = signal(false);

function get_user_info(t){
  api_get('get_user', 
    {"token": t || token_signal.value}
  ).then((cl) => {
    if (typeof (cl[0]) == 'object') {
      client_info.value = cl[0];
      loginmodal_show.value = false;
    } else {
      loginmodal_show.value = true;
    }
  }).catch(e => {
    if(!client_info) loginmodal_show.value = true;
  })
}

if(token_signal.value) {
  loginmodal_show.value = false;
  get_user_info();
}

const onLoginSubmit = (e) => {
  e.preventDefault();
  api_get('create_token', {
    "name": e.target.elements.form_username.value,
    "pw": e.target.elements.form_password.value
  }).then(res => {
    if(res.Error){
      form_response.value = res.Error
    }else{
      token_signal.value = res[0].create_token;
      get_user_info(res[0].create_token);
    }
  }).catch(res => {
    console.error(res);
  })
}

const onRegisterSubmit = (e) => {
  e.preventDefault();
  const pw1 = e.target.elements.form_password.value;
  const pw2 = e.target.elements.form_password_confirm.value;
  if(pw1 === pw2){
    api_get('create_user', {
      "name": e.target.elements.form_username.value,
      "pw": pw1,
    }).then(res => {
      if(res.Error){
        form_response.value = res.Error
      }else{
        console.log(res)
        token_signal.value = res[0].create_user;
        get_user_info(res[0].create_user);
      }
    }).catch(e => {
      console.error(e);
    })
  }else{
    form_response.value = "Passwords must be equal!";
  }
  
}

const close_modal = () => { loginmodal_show.value = false; }

const toggleMode = () => {isRegister.value = !isRegister.value}

function LoginModal() {
  return (
    <Modal show={loginmodal_show.value} onHide={close_modal}>
      <Modal.Header closeButton>
        <Modal.Title><ButtonGroup>
        {["Login", "Register"].map((radio, idx) => (
          <ToggleButton
            type="radio"
            key={idx}
            variant={idx == isRegister.value ? 'outline-primary' : 'outline-primary'}
            checked={idx == isRegister.value}
            onClick={toggleMode}
          >
            {radio}
          </ToggleButton>
        ))}
      </ButtonGroup></Modal.Title>
      </Modal.Header>
      <Form onSubmit={isRegister.value ? onRegisterSubmit : onLoginSubmit}>
        <Modal.Body>
          <Form.Group className="mb-2" controlId="form_username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" />
          </Form.Group>
          <Form.Group className="mb-2" controlId="form_password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          {isRegister.value && (
            <Form.Group className="mb-2" controlId="form_password_confirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm Password" />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close_modal}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            {isRegister.value ? 'Register' : 'Login'}
          </Button>
        </Modal.Footer>
      </Form>
      {form_response.value && (
        <div className="alert alert-primary" role="alert">
          {form_response.value}
        </div>
      )}
    </Modal>
  );
}

export default LoginModal;