import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { useState } from "react";
import axiosInstance from "../../axios";

function Overview({ proposal, mode, submitRef }) {
  const [proposalData, updateProposalData] = useState({
    title: proposal.title,
    donor: proposal.donor,
    assigned: proposal.assigned,
    description: proposal.description,
    priority: proposal.priority,
  });
  const handleChange = (e) => {
    updateProposalData({
      ...proposalData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(proposalData);

    axiosInstance
      .put(`proposals/${proposal.pk}/update/`, proposalData)
      .catch((error) => {
        console.log(error.response);
      })
      .then((res) => {
        console.log(res);
      });
  };
  return (
    <>
      {mode ? (
        <Tab.Container id="list-group-tabs" defaultActiveKey="#link1">
          <Row>
            <Col sm={2}>
              <ListGroup>
                <ListGroup.Item action href="#link1">
                  Description
                </ListGroup.Item>
                <ListGroup.Item action href="#link2">
                  Donor
                </ListGroup.Item>
                <ListGroup.Item action href="#link3">
                  Priority
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <form onSubmit={handleSubmit}>
                  <Tab.Pane eventKey="#link1">
                    <input
                      type="description"
                      label="Enter description"
                      name="description"
                      placeholder={proposalData.description}
                      onChange={handleChange}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="#link2">
                    <input
                      type="donor"
                      label="Enter donor"
                      name="donor"
                      placeholder={proposalData.donor}
                      onChange={handleChange}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="#link3">
                    <input
                      type="priority"
                      label="Enter priority"
                      name="priority"
                      placeholder={proposalData.priority}
                      onChange={handleChange}
                    />
                  </Tab.Pane>
                  <button
                    ref={submitRef}
                    type="submit"
                    style={{ display: "none" }}
                  />
                </form>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      ) : (
        <Tab.Container id="list-group-tabs" defaultActiveKey="#link1">
          <Row>
            <Col sm={2}>
              <ListGroup>
                <ListGroup.Item action href="#link1">
                  Description
                </ListGroup.Item>
                <ListGroup.Item action href="#link2">
                  Donor
                </ListGroup.Item>
                <ListGroup.Item action href="#link3">
                  Priority
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey="#link1">
                  {proposalData.description}
                </Tab.Pane>
                <Tab.Pane eventKey="#link2">{proposalData.donor}</Tab.Pane>
                <Tab.Pane eventKey="#link3">{proposalData.priority}</Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      )}
    </>
  );
}

export default Overview;
