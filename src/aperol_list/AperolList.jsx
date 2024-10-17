import { useEffect } from "react";
import { batch, effect, signal } from "@preact/signals-react";
import { api_get } from "../helper/api_handler";
import { ProgressBar, Row, Col, Container, Button, Form } from "react-bootstrap";
import { token_signal } from "../helper/cookie_handler";
import "./AperolList.css"
import 'bootstrap-icons/font/bootstrap-icons.css';
import { client_info } from "../LoginModal";
import ConfirmModal from "./ConfirmModal";
import UnconfirmedModal from "./UnconfimedModal";

export const amount_arr = signal([]);
export const showConfModal = signal(false);
export const confModalObject = signal({});
export const unconfModal = signal(false);
export const unconfModalArray = signal([]);

async function fill_list(arr){
  const max = Math.max(...arr.map(el => el.sum))
  amount_arr.value = arr.map(el => ({
    ...el, 
    len: el.sum * 100 / max})
  );
  if(arr.find(el => el.user_id == client_info.value.id).to_confirm != 0){
    unconfModal.value = true;
    const res = await api_get("get_history",{
      token: token_signal.value,
      user_id: client_info.value.id,
      confirmed: false}
    );

    unconfModal.value = true;
    unconfModalArray.value = res.map(el => ({
      ...el,
      conf: 1
    }));
    console.log(res);
  }

}

function add_history(user_id, name, amount){
  if(user_id === client_info.value.id){
    submit_add_history(user_id, amount);
  }else{
    showConfModal.value = true;
    confModalObject.value = {user_id: user_id, amount: amount, name: name};
  }
}

export function submit_add_history(user_id, amount){
  showConfModal.value = false;
  api_get("insert_history",
    {
      token: token_signal.value,
      user_id: user_id,
      amount: amount
    }
  ).then((res) => {
    if (res.Error) {
      console.error(res.Error);
    } else {
      fill_list(res)
    }
  }).catch((e) => console.error(e));
}

export function get_amount(){
  api_get("get_amount", 
    {token: token_signal.value}
  ).then((res) => {
    if (res.Error) {
      console.error(res.Error);
    } else {
      fill_list(res)
    }
  }).catch((e) => console.error(e));
}

effect(() => get_amount())

function AperolList() {
  return (
    <Container>
    {amount_arr.value.length === 0 ? (
      <p>No Data</p>
    ) : (
      
      amount_arr.value.map((item) => (
        <Row key={item.user_id} 
          className="align-items-center mb-3" 
          style={{ width: '100%'}}>
          <Col xs={3} className="text-end pe-3">
            <strong>{item.name}</strong>
          </Col>
          <Col xs={8}>
          <ProgressBar 
            now={item.len}  
            label={item.sum}
            style={{
              height: "28px",
              color: "#fff", // Label text color
              backgroundColor: "#e9ecef", // Background color of the unfilled portion
            }}>
            <div
              className="progress-bar"
              style={{
                width: `${item.len}%`, // Progress based on 'now' prop
                backgroundImage: "linear-gradient(to right, #FFC300, #FF5733)", // Gradient for filled portion
              }}>
              {item.sum}
            </div>
          </ProgressBar>
          </Col>
          <Col xs={1} className="d-flex"> 
              <Button
                variant="success"
                size="sm"
                onClick={() => add_history(item.user_id, item.name, 1)}
                style={{ padding: '0px', width: '28px', height: '28px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: item.user_id !== client_info.value.id ? 0.5 : 1
                }}>
              <i className="bi bi-plus" style={{ fontSize: '30px', color: 'white' }}></i>
              </Button>
          </Col>
        </Row>
      ))
    )}
      <ConfirmModal></ConfirmModal>
      <UnconfirmedModal></UnconfirmedModal>
  </Container>
  );
}

export default AperolList;
