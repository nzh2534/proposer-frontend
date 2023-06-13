import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { useState } from 'react';
import axiosInstance from '../../axios';
import Loading from '../Loading';

function OverviewForm({proposal, pk, submitRef}) {
    const [proposalData, updateProposalData] = useState(proposal);
    const [refreshing, updateRefreshing] = useState(false);
    const handleChange = (e) => {
		updateProposalData({
			title: proposal.title,
            donor: proposal.donor,
            assigned: proposal.assigned,
            description: proposal.description,
			[e.target.name]: e.target.value.trim(),
		});
	};

    const handleSubmit = (e) => {
		e.preventDefault();
        updateRefreshing(true);

		axiosInstance
			.put(`proposals/${pk}/update/`, proposalData)
            .catch((error) => {
                console.log(error.response)
            })
			.then(() => {
                window.location.reload()
			});
	};


return (<>{ refreshing ? <Loading /> :
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
                    <input type="description" label="Enter description" name="description" placeholder={proposalData.description} onChange={handleChange} />
                </Tab.Pane>
                <Tab.Pane eventKey="#link2">
                    <input type="donor" label="Enter donor" name="donor" placeholder={proposalData.donor} onChange={handleChange} />
                </Tab.Pane>
                <Tab.Pane eventKey="#link3">
                    <input type="priority" label="Enter priority" name="priority" placeholder={proposalData.priority} onChange={handleChange} />
                </Tab.Pane>
                <button ref={submitRef} type="submit" style={{ display: 'none' }} />
            </form>
            </Tab.Content>
            </Col>
        </Row>
    </Tab.Container>
}</>);
}

export default OverviewForm;