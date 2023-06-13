import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Loading from "./Loading";

import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Navbar from 'react-bootstrap/Navbar';
import { faPenToSquare, faFloppyDisk, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from 'react-bootstrap/Container';

import axiosInstance from "../axios";

import { Calendar, ComplianceListV2 } from "./tools/index";
import Button from "react-bootstrap/esm/Button";
import Outline from "./tools/Outline(backup)";


function DetailView() {
  const {pk} = useParams();
  const [proposalData, setProposalData] = useState({
    loading: true,
    res: []
  });

  const submitRef = useRef();
  const [editMode, updateEditMode] = useState({
    activate: false
  });

  useEffect(() => {
    axiosInstance
    .get(`/proposals/${pk}`)
    .catch((error) => {
      console.log(error)
    })
    .then((res) => {
      setProposalData({ loading: false, res: res.data });
    });
  }, [setProposalData, pk]);

  const handleChange = (e) => {
		setProposalData({
      loading: false,
      res:{
      ...proposalData.res,
      [e.target.name]: e.target.value.trim()}
    });
	};

  const handleEditMode = (e) => {
		updateEditMode({
      activate: e
    });
	};

	const handleSubmit = (e) => {
    submitRef.current.click()
    updateEditMode({
      activate: e
    });
    axiosInstance
    .put(`/proposals/${pk}/update/`,{
      title: proposalData.res.title
    })
    .catch((error) => {
      console.log(error)
    })
    .then((res) => {
      console.log(res)
    });
  };

    return (<>{proposalData.loading ? <Loading /> : 
    <Tab.Container className="h-100vh" id="list-group-tabs" defaultActiveKey="#link1">
        <Row className="h-100vh">
          <Col className="d-flex justify-content-center bg-dark h-100%" lg={2} style={{height: '100vh'}}>
            <ListGroup className="w-100 align-content-center ms-3">
            <ListGroup.Item>
            {editMode.activate ? 
              <Container>
              <Navbar style={{borderBottom: "3px solid rgb(212, 212, 212)"}} variant="light" bg="white" className="d-flex justify-content-center mb-2">
                <Navbar.Brand><input onChange={handleChange} name="title" defaultValue={proposalData.res.title}/></Navbar.Brand>
              </Navbar>
              <Button onClick={() => handleSubmit(false)}><FontAwesomeIcon icon={faFloppyDisk} /></Button>
              <Button bg="danger" variant="danger" href={`/proposals/${proposalData.res.pk}/delete`} style={{marginLeft: "5px"}}><FontAwesomeIcon icon={faTrashCan} /></Button>
              </Container>
              :
              <Container>
              <Navbar style={{borderBottom: "3px solid rgb(212, 212, 212)"}} variant="light" bg="white" className="d-flex justify-content-center mb-2">
                <Navbar.Brand>{proposalData.res.title}</Navbar.Brand>
              </Navbar>
              <Button onClick={() => handleEditMode(true)}><FontAwesomeIcon icon={faPenToSquare} /></Button>
              </Container>
              }
              </ListGroup.Item>
              <ListGroup.Item action href="#link1">
                Compliance
              </ListGroup.Item>
              <ListGroup.Item action href="#link2">
                Calendar
              </ListGroup.Item>
              <ListGroup.Item action href="#link3">
                Outline
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col lg={10}>
            <Tab.Content className="h-100vh">
              <Tab.Pane eventKey="#link1">
                <ComplianceListV2 proposal={proposalData.res} mode={editMode.activate} submitRef={submitRef}/>
              </Tab.Pane>
              <Tab.Pane eventKey="#link2">
                <Calendar proposal={proposalData.res} mode={editMode.activate} loading={proposalData.loading}/>
              </Tab.Pane>
              <Tab.Pane eventKey="#link3">
                <Outline proposal={proposalData.res} mode={editMode.activate} submitRef={submitRef}/>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
}</>);
}


export default DetailView;