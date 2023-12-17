import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../App.css";

import React, { useState } from "react";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const initialFormData = Object.freeze({
    username: "",
    password: "",
  });

  const [formData, updateFormData] = useState(initialFormData);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance
      .post(`token/`, {
        username: formData.username,
        password: formData.password,
      })
      .catch((error) => {
        alert(error);
      })
      .then((res) => {
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        localStorage.setItem("username", JSON.parse(res.config.data).username);
        axiosInstance.defaults.headers["Authorization"] =
          "JWT " + localStorage.getItem("access_token");
        navigate("/dashboard");
      });
  };

  return (
    <Form className="d-flex justify-content-center Center-item">
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="username"
          label="Enter Username"
          name="username"
          placeholder="Enter username"
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          label="Password"
          placeholder="Password"
          onChange={handleChange}
        />
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Submit
      </Button>
    </Form>
  );
}

export default Login;
