import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { useNavigate } from "react-router-dom";

import axiosInstance from "../../axios";

function DeleteProposalModal(props) {
  const show = props.show;
  const setShow = props.setShow;
  const proposalData = props.proposalData;

  const handleClose = () => setShow(false);

  const navigate = useNavigate();

  const handleDeleteProposal = (e) => {
    e.preventDefault();

    axiosInstance.delete(`proposals/${proposalData.pk}/delete/`).then((res) => {
      navigate("/proposals");
    });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Proposal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Delete proposal {proposalData.pk}: {proposalData.title}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDeleteProposal}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteProposalModal;
