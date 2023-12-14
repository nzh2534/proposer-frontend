import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import React, { useState } from "react";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";


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
      style={{ marginRight: "100px", marginLeft: "100px", marginTop: "5vh" }}
    >
      <Row className="d-flex align-items-center justify-content-center">
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="textarea"
              label="title"
              name="title"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="textarea"
              label="description"
              name="description"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Donor</Form.Label>
            <Form.Control
              type="text"
              label="donor"
              name="donor"
              as="select"
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="USAID">USAID</option>
              <option value="USDOS">USDOS</option>
              <option value="KOICA">KOICA</option>
              <option value="Other">Other</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Control
              type="text"
              label="priority"
              name="priority"
              as="select"
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Assigned</Form.Label>
            <Form.Control
              type="text"
              label="assigned"
              name="assigned"
              as="select"
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="Momodu">Momodu</option>
              <option value="Claude">Claude</option>
            </Form.Control>
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
