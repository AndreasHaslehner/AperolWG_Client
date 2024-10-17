import { Button, Modal, Table, Form, ButtonGroup, ToggleButton } from "react-bootstrap";
import { useState } from "react";
import { api_get } from "../helper/api_handler";
import { token_signal } from "../helper/cookie_handler";
import { get_amount, unconfModal, unconfModalArray } from "./AperolList";

function confirm_selected(switchStates) {
  // Filter out the rows where the switch is not in the middle/neutral position
  unconfModalArray.peek().forEach(async (row) => {
    if(row.conf != 1){
      await confirm_drink(row.id, row.conf == 0)
    }
  });
  unconfModal.value = false;
}

function confirm_drink(id, confirm) {
  api_get("set_confirmed", {
    token: token_signal.value,
    id: id,
    confirmed: confirm
  })
    .then((res) => console.log(res))
    .catch((e) => console.error(e));
}

function UnconfirmedModal() {
  const handleSwitchChange = (col, row) => {
    console.log([col, row])
    const updatedArray = unconfModalArray.peek().map((item, index) => 
      index === row ? { ...item, conf: col } : item
    );
    unconfModalArray.value = updatedArray;
    console.log(unconfModalArray.peek())
  };

  const radios = [
    { name: 'Ok', value: true, var: ["outline-success", "success"] },
    { name: '', value: null, var: ["outline-secondary", "secondary"]},
    { name: 'Nö', value: false, var: ["outline-danger", "danger"]},
  ];

  return (
    <Modal show={unconfModal.value} onHide={() => (unconfModal.value = false)}>
      <Modal.Header closeButton>
        <Modal.Title>Seems like you got some drinks, right?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table>
          <thead>
            <tr>
              <th>Buddy</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Accept</th>
            </tr>
          </thead>
          <tbody>
            {unconfModalArray.value.map((el, row) => (
              <tr key={el.id}>
                <td>{el.editor}</td>
                <td>{new Date(el.create_time).toLocaleString("de-DE")}</td>
                <td>{el.amount}</td>
                <td>
                <ButtonGroup className="mb-2">
                  {radios.map((radio, idx) => (
                    <ToggleButton
                      key={idx}
                      type="radio"
                      variant={el.conf == idx ? radio.var[1]:radio.var[0]}
                      value={radio.value}
                      onClick={(e) => handleSwitchChange(idx, row)}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => (unconfModal.value = false)}>
          Shut Up!
        </Button>
        <Button
          variant="primary"
          onClick={() => confirm_selected()}
        >
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UnconfirmedModal;
