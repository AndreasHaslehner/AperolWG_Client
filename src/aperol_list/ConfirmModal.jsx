import { Button, Modal } from "react-bootstrap"
import { confModalObject, showConfModal, submit_add_history } from "./AperolList";

function ConfirmModal(){
  return(
    <Modal show={showConfModal.value} onHide={() => (showConfModal.value = false)}>
      <Modal.Header closeButton>
        <Modal.Title>{confModalObject.value.name} ?</Modal.Title>
      </Modal.Header>
      <Modal.Body>Does your buddy desperately need an Aperooly or are you drunk?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => (showConfModal.value = false)}>
          Drunk
        </Button>
        <Button variant="primary" 
          onClick={()=>(submit_add_history(confModalObject.value.user_id, confModalObject.value.amount))}>
          Aperol!
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal;


