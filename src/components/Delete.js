import "../App.css";
import Button from "react-bootstrap/esm/Button";
import { useParams } from "react-router-dom";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

function Delete({ proposals }) {
  const { pk } = useParams();
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.preventDefault();

    axiosInstance
      .delete(`proposals/${pk}/delete/`)
      .catch((error) => {
        console.log(error.response);
      })
      .then((res) => {
        console.log(res);
        navigate("../proposals");
      });
  };

  return (
    <>
      {proposals ? (
        <div className="d-flex justify-content-center Center-item">
          Are you sure you want to delete?
          <div className="d-flex">
            <Button variant="danger" type="submit" onClick={handleDelete}>
              DELETE
            </Button>
            <Button
              style={{ marginLeft: "1vw" }}
              variant="primary"
              href={`/proposals/${pk}`}
            >
              Return to Proposal
            </Button>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Delete;
