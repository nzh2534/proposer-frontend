import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { useNavigate } from "react-router-dom";

import axiosInstance from "../../axios";

function DeleteTemplateModal(props) {
  const show = props.show;
  const setShow = props.setShow;
  const templateData = props.templateData;

  const handleClose = () => setShow(false);

  const navigate = useNavigate();

  const handleDeleteTemplate = (e) => {
    e.preventDefault();

    axiosInstance.delete(`proposals/template/${templateData.id}/delete/`).then((res) => {
      navigate("/template");
    });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Delete template {templateData.id}: {templateData.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDeleteTemplate}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteTemplateModal;
