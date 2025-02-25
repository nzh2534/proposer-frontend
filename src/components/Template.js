import ListGroup from "react-bootstrap/ListGroup";
import { Button, Form, Table, Row, Col } from "react-bootstrap";
import { useState } from "react";
import axiosInstance from "../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import DeleteTemplateModal from "./tools/DeleteTemplateModal";

function Template(props) {
  const { template } = props;
  console.log(template)
  return (
    <ListGroup.Item action>
      {template.name}
    </ListGroup.Item>
  );
}


function UpdateTemplate({checklistprop, nameprop, id, test, exists}) {
    const [checklist, setChecklist] = useState(checklistprop);
    const [name, setName] = useState(nameprop);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleSaveChecklist = (e) => {
        console.log(checklist);
        console.log(test)

        if (exists) {
            axiosInstance
                .put(`proposals/template/${id}/update/`, {
                    name: name,
                    checklist: checklist,
                    id: id
                })
                .catch((error) => {
                    console.log(error.response);
                })
                .then((res) => {
                    console.log(res);
                    alert(`New Template Saved!`);
                });
        }else {
            axiosInstance
                .post(`proposals/template/`, {
                    name: name,
                    checklist: checklist,
                })
                .catch((error) => {
                    console.log(error.response);
                })
                .then((res) => {
                    console.log(res);
                    alert(`${name} Template Saved!`);
                });
        }



      };

    const handleAddToChecklist = () => {
        var checklistCopy = [...checklist];
        var maxId = Math.max(...checklistCopy.map((o) => o.id));
        checklistCopy.push({ item: "", id: maxId + 1, data: "", page: "", prompt: ""});
        setChecklist(checklistCopy);
    };

    const handleChecklistChange = (e) => {
        var checklistCopy = [...checklist];
        const items = e.target.name.split("_");
        const index = checklistCopy.findIndex(
            (obj) => obj.id === parseInt(items[0]),
        );
        checklistCopy[index][items[1]] = e.target.value;
        console.log(checklistCopy);
        setChecklist(checklistCopy);
    };


    return (
        <Row className="mt-2">
            <Row>
                <Col className="d-flex flex-row justify-content-center">
                    <Form.Control
                        name={name}
                        as="input"
                        value={name}
                        placeholder="Input a Template Name"
                        style={{width:"30vw", marginBottom: "1vh", marginRight: "1vh"}}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />
                    <Button
                        style={{ marginBottom: "1vh"}}
                        onClick={() => handleAddToChecklist()}
                    ><FontAwesomeIcon size="xl" icon={faPlus}/></Button>
                    <Button
                        style={{
                        marginBottom: "1vh",
                        marginLeft: "1vh",
                        marginRight: "1vh",
                        }}
                        onClick={() => handleSaveChecklist()}
                    ><FontAwesomeIcon size="xl" icon={faSave}/></Button>
                    <Button
                        style={{ backgroundColor: "#f44336", color: "white", marginBottom: "1vh"}}
                        onClick={() => setShowDeleteModal(true)}
                    >
                        <FontAwesomeIcon size="xl" icon={faTrash}/>
                    </Button>
                    <DeleteTemplateModal
                        show={showDeleteModal}
                        setShow={setShowDeleteModal}
                        templateData={{id: id, name: nameprop}}
                    />
                </Col>
            </Row>
        <Table striped bordered hover className="m-3">
        <thead>
          <tr>
            <th>Item Abbreviation</th>
            <th>AI Prompt</th>
          </tr>
        </thead>
        <tbody>
          {checklist?.map((item, index) => {
            return (
              <tr
                key={index}
                name={item.id
                  .toString()
                  .concat("_item")}
              >
                <td
                  style={{
                    maxWidth: "20vh"
                  }}
                >
                  <Form.Control
                    name={item.id
                      .toString()
                      .concat("_item")}
                    as="textarea"
                    value={item.item}
                    onChange={(e) =>
                      handleChecklistChange(e)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    name={item.id
                      .toString()
                      .concat("_prompt")}
                    as="textarea"
                    value={item.prompt}
                    onChange={(e) =>
                      handleChecklistChange(e)
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      </Row>
    );
  };

function ListViewTemplates({ templates }) {
const [selectedTemplate, setSelectedTemplate] = useState({
    "template": false,
    "creating": false,
    "item": []
    });
    console.log(templates)
  return (<Row><Col className="d-flex justify-content-center align-items-center" >{ (selectedTemplate.creating === true) ?
    <UpdateTemplate checklistprop={[{"id": 0, "data": "", "item": "", "page": "", "prompt": ""}]} nameprop={"Add a Template Name"} id={false} exists={false}/>
    : (selectedTemplate.template === true) ?
    <UpdateTemplate checklistprop={selectedTemplate.item.checklist} nameprop={selectedTemplate.item.name} id={selectedTemplate.item.id} test={selectedTemplate.item} exists={true}/>
    :  
    <ListGroup className="mt-3" defaultActiveKey="#">
      {templates?.map((item, index) => {
        return <ListGroup.Item action template={item} key={index} onClick={() => {setSelectedTemplate({"template": true, "creating": false, "item": item})}}> {item.name} </ListGroup.Item>
      })}
      <Button className="mt-3" onClick={() => {setSelectedTemplate({"template": false, "creating": true, "item": []})}}>Create New Template <FontAwesomeIcon size="xl" icon={faPlus}/></Button>
    </ListGroup>
}</Col></Row>);
}

export default ListViewTemplates;