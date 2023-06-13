import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import React, { useState } from 'react';
import axiosInstance from '../axios';
import { useNavigate } from 'react-router-dom';
// import Loading from './Loading';

function Create({proposals}) {
    // const remove = ["url","edit_url", "pk", "event_set", "word_analysis", "compliance"]
    // const deleteitems = proposals ? remove.map((item) => {delete proposals[item]}) : null
    // const arr = proposals ? Object.keys(proposals) : null
    // const values = proposals ? Object.values(proposals) : null
    // const typesarr = []
    // const types = values ? values.map((value) => {typesarr.push(typeof(value))}) : null

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
                assigned: formData.assigned
			})
            .catch((error) => {
                alert(error)
            })
			.then((res) => {
				navigate(`../proposals/${res.data.pk}`);
				console.log(res);
				console.log(res.data.pk);
			});
	};

    // {arr ?
	// 	arr.map((key, index) => {
	// 		return <Form.Group className="mb-3" key={index}>
	// 		<Form.Label>{key}</Form.Label>
	// 		<Form.Control type={key} label={"Enter " + key} name={key} onChange={handleChange}/>
	// 	  </Form.Group>
	// }) : <Loading />}
return (
<Form style={{ marginRight: "100px", marginLeft: "100px", marginTop: "5vh"}}>
	<Form.Group className="mb-3">
		<Form.Label>Title</Form.Label>
		<Form.Control type="text" label="title" name="title" onChange={handleChange}/>
	</Form.Group>
	<Form.Group className="mb-3">
		<Form.Label>Description</Form.Label>
		<Form.Control type="text" label="description" name="description" onChange={handleChange}/>
	</Form.Group>
	<Form.Group className="mb-3">
		<Form.Label>Donor</Form.Label>
		<Form.Control type="text" label="donor" name="donor" onChange={handleChange}/>
	</Form.Group>
	<Form.Group className="mb-3">
		<Form.Label>Priority</Form.Label>
		<Form.Control type="text" label="priority" name="priority" onChange={handleChange}/>
	</Form.Group>
	<Form.Group className="mb-3">
		<Form.Label>Assigned</Form.Label>
		<Form.Control type="text" label="assigned" name="assigned" onChange={handleChange}/>
	</Form.Group>
	<Button variant="primary" type="submit" onClick={handleSubmit}>
			Submit
	</Button>
</Form>
);
}

export default Create;