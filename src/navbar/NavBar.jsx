import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { signal } from "@preact/signals-react";

import { client_info, client_online, loginmodal_show } from '../LoginModal';
import { Alert, Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import { api_error_msg, api_get } from '../helper/api_handler';
import { show_app } from '../App';
import { amount_arr } from '../aperol_list/AperolList';
import { token_signal } from '../helper/cookie_handler';

const showToast = signal(false);

function set_log_scale(active){
  const max = Math.max(...amount_arr.peek().map(el => el.sum))
  if(active){
    amount_arr.value = amount_arr.peek().map(el => ({
      ...el, 
      len: Math.log(el.sum+1) / Math.log(max+1) * 100})
    );
  }else{
    amount_arr.value = amount_arr.peek().map(el => ({
      ...el, 
      len: el.sum * 100 / max})
    );
  }
}

function copyTokenToClipboard(){
  navigator.clipboard.writeText(token_signal.peek())
    .then(() => {
      // Show toast on success
      showToast.value = true;
      setTimeout(() => showToast.value = false, 3000); // Automatically hide toast after 3 seconds
    })
    .catch(err => {
      console.error("Failed to copy text: ", err);
    });
};

function NavBar() {

  return (
    <Navbar expand="lg" fixed="top" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>Aperol Spritz WG</Navbar.Brand>
        <Alert variant="danger"
               show={api_error_msg.value?true:false}>
          {api_error_msg.value}
        </Alert>
        <Button onClick={() => {loginmodal_show.value = true}}
                variant={(client_online.value) ? "success" : "danger"}>
          {(client_info.value) ? client_info.value.name : 'Login'}
        </Button>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Logarithmic Scale (natural)"
              onChange={(e) => set_log_scale(e.target.checked)}
            />
            <Button size="sm" onClick={copyTokenToClipboard}>CopyToken</Button>
            <Nav.Link disabled
              onClick={() => show_app.value = 99}
            >Nothing</Nav.Link>
            <Nav.Link href="#link" disabled>Here</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <ToastContainer position="top-center" className="p-3">
        <Toast 
          show={showToast.value} 
          onClose={() => showToast.value = false}>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>Token copied to clipboard!</Toast.Body>
        </Toast>
      </ToastContainer>
    </Navbar>
  );
}

export default NavBar;