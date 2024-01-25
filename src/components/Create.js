import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import React, { useState } from "react";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

import "./Create.css";

function Create({ proposals }) {
  const navigate = useNavigate();
  const [formData, updateFormData] = useState({});

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    axiosInstance
      .post(`proposals/`, {
        title: formData.title,
        description: formData.description,
        donor: formData.donor,
        priority: formData.priority,
        assigned: formData.assigned,
      })
      .catch((error) => {
        alert(error);
      })
      .then((res) => {
        navigate(`../proposals/${res.data.pk}`);
        console.log(res);
        console.log(res.data.pk);
      });
  };

  return (
    <Form
      style={{
        marginRight: "100px",
        marginLeft: "100px",
        marginTop: "5vh",
      }}
    >
      <Row className="d-flex align-items-center justify-content-center">
        <Col
          style={{
            maxWidth: "500px",
            backgroundColor: "hsl(1,0%,90%)",
            padding: "20px",
            borderRadius: "7px",
            margin: "10px",
          }}
        >
          <Form.Label style={{ fontSize: "20px" }}>
            Create a new proposal
          </Form.Label>
          <hr />
          <Form.Group className="mb-3 form-group">
            <Form.Label className="form-label">Title</Form.Label>
            <Form.Control
              type="textarea"
              label="title"
              name="title"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3 form-group">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="textarea"
              label="description"
              name="description"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 form-group">
            <Form.Label>Donor</Form.Label>
            <Form.Select
              type="text"
              label="donor"
              name="donor"
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="USAID">USAID</option>
              <option value="USDOS">USDOS</option>
              <option value="KOICA">KOICA</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3 form-group">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              type="text"
              label="priority"
              name="priority"
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3 form-group">
            <Form.Label>Assigned</Form.Label>
            <Form.Select
              type="text"
              label="assigned"
              name="assigned"
              onChange={handleChange}
            >
              <option value=""></option>
              <option value={localStorage.getItem("username")}>{localStorage.getItem("username")}</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Submit
      </Button>
    </Form>
  );
}

export default Create;
