import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import {useDropzone} from 'react-dropzone';
import '../../App.css';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios';
import Loading from '../Loading';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import { faPenToSquare ,faTrashCan, faUndo, faCalendar, faFileWord, faPlus, faX, faFloppyDisk, faClockRotateLeft, faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Tabs from 'react-bootstrap/Tabs';
import Container from 'react-bootstrap/esm/Container';

import { Configuration, OpenAIApi } from "openai";
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Outline from './Outline';


function ComplianceListV2() {
const {pk} = useParams();
const [editMode, updateEditMode] = useState(false);
const [proposalData, updateProposalData] = useState(false);
const [complianceData, updateComplianceData] = useState();
const [imageMode, updateImageMode] = useState(false);
const [sectionData, updateSectionData] = useState();
const [activeSectionData, updateActiveSectionData] = useState("Section Filters");
const [aiPrompts, updateAiPrompts] = useState(["Summarize the following text for me"]);
const [activeAiPrompt, updateActiveAiPrompt] = useState("");
const [aiData, updateAiData] = useState([]);
const [runningTrigger, updateRunningTrigger] = useState(false);

const { getRootProps, getInputProps, acceptedFiles } = useDropzone({maxFiles:1});

useEffect(() => {
    axiosInstance
    .get(`/proposals/${pk}`)
    .catch((error) => {
      console.log(error)
    })
    .then((res) => {
      updateProposalData(res.data);
      console.log(res.data.complianceimages_set)
      updateComplianceData(res.data.complianceimages_set);
      updateSectionData(res.data.compliance_sections);
    });
  }, [updateProposalData, pk]);


const [addingSection, updateAddingSection] = useState({
    adding: false,
    section: null,
    start: null,
    end: null
}); 

const [addingPrompt, updateAddingPrompt] = useState({
    adding: false,
    prompt: null
}); 

const [focusData, updateFocusData] = useState({
    focusing: false,
    data: {}
});


const configuration = new Configuration({
    organization: "org-QuYDdeJx68kBjwz6lLg7qZe4",
    apiKey: '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',
    });
const openai = new OpenAIApi(configuration);


const files = acceptedFiles.map((file) => (
    <li key={file.path}>
        {file.path} - {file.size} - {file.type}bytes
    </li>
    ));


const handleSubmitNofo = (e) => {
    e.preventDefault();
    if (acceptedFiles[0] == null){
        alert("Please input a PDF")
    }
    else {
        let formData = new FormData();
        formData.append('title', proposalData.title)
        formData.append('nofo', acceptedFiles[0])
        axiosInstance.defaults.headers['Content-Type'] = 'multipart/form-data';
        axiosInstance.defaults.timeout = 2000000;// axiosInstance.timeout = 2000000;
        updateRunningTrigger(true);
        axiosInstance
            .put(`proposals/${pk}/update/`, formData)
            .catch((error) => {
                axiosInstance.defaults.headers['Content-Type'] = 'application/json';
                axiosInstance.defaults.timeout = 30000;
                console.log(error.response)
            })
            .then((res) => {
                axiosInstance.defaults.headers['Content-Type'] = 'application/json';
                axiosInstance.defaults.timeout = 30000;
                if (res.status === 200){
                    console.log(res.data)
                    updateProposalData(res.data);
                    updateRunningTrigger(false);
                }
            });
    };
};

// const handleChangeTitle = (e) => {
//     console.log(e.target.name);
//     console.log(e.target.value.trim());
//     const newComplianceData = [...complianceData];
//     newComplianceData[e.target.name].title_text = e.target.value.trim();
//     updateComplianceData(newComplianceData);
// };

// const handleChangeContent = (e) => {
//     console.log(e.target.name);
//     console.log(e.target.value.trim());
//     const newComplianceData = [...complianceData];
//     newComplianceData[e.target.name].content_text = e.target.value.trim();
//     updateComplianceData(newComplianceData);
// };

const handleFocus = (id) => {
    const result = complianceData.find(obj => {
        return obj.id === parseInt(id)
      })
    const resultCopy = result
    console.log(result)
    updateFocusData({
        focusing: true,
        data: resultCopy,
    })
};


//drag reference: https://www.cssportal.com/html-event-attributes/ondrop.php
const handleDrag = (e) => {
    e.dataTransfer.setData('name', e.target.name);
}

const handleAllowDrop = (e) => {
    e.preventDefault();
}

const handleDropCalendar = (e) => {
    console.log(e.dataTransfer.getData('name'))
}

const handleDropOutline = async (e) => {
    var id = e.dataTransfer.getData('name')
    var specificComplianceItem = complianceData.find((item)=>{
        return item.id === parseInt(id)
    })
    var previousData = aiData
    var prompt = activeAiPrompt + ": "
    try {
        const result = await openai.createCompletion({
          model: "text-davinci-003",
          max_tokens: 1024,
          prompt: prompt.concat(specificComplianceItem.content_text),
        });
        previousData.push(result.data.choices[0].text)
        updateAiData(previousData)
      } catch (e) {
        //console.log(e);
        console.log(e);
      }

}

const handleDropDelete = (e) => {
    const id = e.dataTransfer.getData('name');
    const filteredComplianceArray = complianceData.filter(obj =>{
        return obj.id !== parseInt(id)
    })
    updateComplianceData(filteredComplianceArray)
    axiosInstance
        .delete(`proposals/${pk}/compliance/${id}/delete/`)
        .catch((error) => {
            console.log(error.response)
        })
        .then((res) => {
            console.log(res)
        });
}

// const handleSubmit = (e) => {
//     e.preventDefault();
//     const newProposalData = Object.assign({}, proposalData);
//     newProposalData.complianceimages_set = [...complianceData];
//     updateProposalData(newProposalData)

//     axiosInstance
//         .put(`proposals/${proposal.pk}/update/`, {
//             title: proposalData.title,
//             complianceimages_set: [...complianceData]
//         })
//         .catch((error) => {
//             console.log(error.response)
//         })
//         .then((res) => {
//             console.log(res)
//         });
// };

//new section functionality
const handleChangeNewSection = (e) => {
    var addingSectionCopy = addingSection
    console.log(e.target.value.trim())
    addingSectionCopy[e.target.name] = e.target.value.trim()
    updateAddingSection(addingSectionCopy)
}

const handleSubmitNewSection = () => {
    var copySectionData = sectionData
    copySectionData[addingSection.section] = [parseInt(addingSection.start), parseInt(addingSection.end)]
    console.log(copySectionData)
    updateSectionData(copySectionData)
    updateAddingSection({adding: false, section: null, start: null, end: null})
    axiosInstance
        .put(`proposals/${pk}/update/`, {
            title: proposalData.title,
            compliance_sections: sectionData
        })
        .catch((error) => {
            console.log(error.response)
        })
        .then((res) => {
            console.log(res)
        });
}

const handleActiveFilter = (e) => {
    if(e.target.name.includes("flagged")){
        updateActiveSectionData("Flagged Content")
        const complianceDataCopy = complianceData
        const filteredComplianceData = complianceDataCopy.filter(item =>
            item.flagged.includes('red')
        )
        updateComplianceData(filteredComplianceData)

    }else{
        updateActiveSectionData(e.target.name)
        var filterPages = sectionData[e.target.name]
        var filteredComplianceData = complianceData.filter((item) => item.page_number >= filterPages[0] && item.page_number <= filterPages[1])
        updateComplianceData(filteredComplianceData)
    }
}

const handleImageMode = (e) => {
    updateImageMode(e)
}

const handleChangeNewPrompt = (e) => {
    var addingPromptCopy = addingPrompt
    addingPromptCopy[e.target.name] = e.target.value.trim()
    updateAddingPrompt(addingPromptCopy)
}

const handleSavePrompt = (prompt) => {
    var currentPromptsCopy = aiPrompts
    currentPromptsCopy.push(prompt)
    updateActiveAiPrompt(prompt)
    updateAddingPrompt({adding: false, prompt: null})
    updateAiPrompts(currentPromptsCopy)
}

const handleChangeProposalTitle = (e) => {
    let proposalDataCopy = proposalData
    proposalDataCopy.title = e.target.value
    updateProposalData(proposalDataCopy)
};

const handleEditMode = (e) => {
    if(e){
        updateEditMode(e);
    }else{
        updateEditMode(e);
        axiosInstance
        .put(`proposals/${pk}/update/`, {
            title: proposalData.title
        })
        .catch((error) => {
            console.log(error.response)
        })
        .then((res) => {
            console.log(res)
        });
    }
}

const handleSubmitCompliance = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target),
          formDataObj = Object.fromEntries(formData.entries())
    let focusDataCopy = focusData.data;
    delete focusDataCopy.title
    delete focusDataCopy.content
    axiosInstance
        .put(`proposals/${pk}/compliance/${focusData.data.id}/update/`, {
            ...focusDataCopy,
            title_text: formDataObj.title,
            content_text: formDataObj.content
        })
        .catch((error) => {
            console.log(error.response)
        })
        .then((res) => {
            console.log(res)
        });
}

const handleChangeCompliance = (e) => {
    const focusDataCopy = focusData.data;
    if(e.target.name.includes('title')){
        focusDataCopy.title_text = e.target.value
    }else{
        focusDataCopy.content_text = e.target.value
    };
    updateFocusData({focusing: true, data: focusDataCopy});
}

const handleFlagged = (id) => {
    const complianceDataCopy = complianceData
    const itemIndex = complianceData.findIndex((item)=>{
        return item.id === parseInt(id)
    })
    if(complianceDataCopy[itemIndex].flagged.includes("white")){
        complianceDataCopy[itemIndex].flagged = "red"
    }else{
        complianceDataCopy[itemIndex].flagged = "white"
    }
    updateComplianceData(complianceDataCopy)
    axiosInstance
        .put(`proposals/${pk}/compliance/${id}/update/`, {
            proposal: complianceDataCopy[itemIndex].proposal,
            flagged: complianceDataCopy[itemIndex].flagged,
        })
        .catch((error) => {
            console.log(error.response)
        })
        .then((res) => {
            console.log(res)
        });
}

return (<> 

{proposalData ? 

<Tab.Container className="h-100vh" id="list-group-tabs" defaultActiveKey="#link1">
        <Row className="h-100vh">
          <Col className="d-flex justify-content-center bg-dark h-100%" lg={2} style={{height: '100vh'}}>
            <ListGroup className="w-100 align-content-center ms-3">
                <ListGroup.Item>
                <Container>
                        {editMode ? 
                        <Container>
                        <input style={{maxWidth:"10vw"}} onChange={handleChangeProposalTitle} type="text" placeholder={proposalData.title}/>
                        <div onClick={()=>handleEditMode(false)} ><FontAwesomeIcon icon={faFloppyDisk} size="s"/></div>
                        </Container>
                        : 
                        <Container>
                        {proposalData.title}
                        <div onClick={()=>handleEditMode(true)} ><FontAwesomeIcon icon={faPenToSquare} size="s"/></div>
                        </Container>
                        }
                </Container>
                </ListGroup.Item>
                <ListGroup.Item action href="#link1">
                Compliance
                </ListGroup.Item>
                { proposalData.nofo ?
                <>
                {/* <ListGroup.Item action href="#link2">
                Calendar
                </ListGroup.Item> */}
                <ListGroup.Item action href="#link3">
                Outline
                </ListGroup.Item>
                </>
                :
                <></>}
            </ListGroup>
          </Col>
          <Col lg={10}>
            <Tab.Content className="h-100vh">
              <Tab.Pane eventKey="#link1">

{proposalData ? proposalData.nofo ? focusData.focusing ?

//focusing
<Form onSubmit={(e) => handleSubmitCompliance(e)}>
<Button style={{marginRight:'1vw', marginTop: "5px", backgroundColor: "#9ab6da"}} onClick={() => updateFocusData({focusing: false, data: {}})}><FontAwesomeIcon icon={faUndo} /></Button>
<Button type="submit" style={{marginLeft:'1vw', marginTop: "5px"}}><FontAwesomeIcon icon={faFloppyDisk} /></Button>
<Tabs
      defaultActiveKey="title"
      id="uncontrolled-tab-focus"
      className="mb-3"
    >
    
      <Tab eventKey="title" title="Title">
        <Row>
            <Col><Form.Control onChange={(e)=>handleChangeCompliance(e)} style={{height: '50vh', width: '100%'}} as="textarea" name="title" defaultValue={focusData.data.title_text}/></Col>
            <Col><img src={focusData.data.title} alt="header visual"/></Col>
        </Row>
      </Tab>
      <Tab eventKey="content" title="Content">
        <Row>
            <Col><Form.Control onChange={(e)=>handleChangeCompliance(e)} style={{height: '50vh', width: '100%'}} as="textarea" name="content" defaultValue={focusData.data.content_text}/></Col>
            <Col><img src={focusData.data.content} alt="content visual"/></Col>
        </Row>
      </Tab>
</Tabs>
</Form>
:
//viewing
<>
<Navbar style={{borderBottom: "3px solid rgb(212, 212, 212)"}} variant="light" bg="white" className="d-flex justify-content-center mb-2">
    <Dropdown>
        <Dropdown.Toggle style={{backgroundColor: "white"}} id="dropdown-basic">
            {activeSectionData}
        </Dropdown.Toggle>
        <Dropdown.Menu>
        {Object.keys(sectionData)?.map((item, index)=>{
                return <Dropdown.Item name={item} key={index} onClick={(e) => handleActiveFilter(e)}>{item}: {sectionData[item][0]}-{sectionData[item][1]}</Dropdown.Item>
            })}
        <Dropdown.Item name="flagged" onClick={(e) => handleActiveFilter(e)}><FontAwesomeIcon color="red" icon={faFlag} /> Flagged Content</Dropdown.Item>
        {addingSection.adding ?
        <Container style={{ paddingTop: "1vh", borderTop: "3px solid rgb(212, 212, 212)"}}>
            <textarea type="text" name="section" placeholder="Section Name" onChange={(e)=> handleChangeNewSection(e)}/>
            <input type="number" name="start" placeholder="Page Start (Number Only)" onChange={(e)=> handleChangeNewSection(e)}/>
            <input type="number" name="end" placeholder="Page End (Number Only)" onChange={(e)=> handleChangeNewSection(e)}/>
            <Row>
                <Dropdown.Item onClick={() => handleSubmitNewSection()}><FontAwesomeIcon size="sm" icon={faFloppyDisk} /></Dropdown.Item>
                <Dropdown.Item onClick={() => updateAddingSection({adding: false, section: null, start: null, end: null})}><FontAwesomeIcon size="sm" icon={faX} /></Dropdown.Item>
            </Row>
        </Container>
        :
        <>
        <Dropdown.Item onClick={() => { updateComplianceData(proposalData.complianceimages_set); updateActiveSectionData("Section Filters");}}><FontAwesomeIcon size="sm" icon={faClockRotateLeft} /> Reset</Dropdown.Item>
        <Dropdown.Item onMouseEnter={() => updateAddingSection({...addingSection, adding: true})}><FontAwesomeIcon size="sm" icon={faPlus} /> Add</Dropdown.Item>
        </>
        }
        </Dropdown.Menu>
    </Dropdown>
    <Col style={{ padding: "3px", backgroundColor: "#AEBC37", borderRadius: "5px", marginLeft:'1vw', marginRight:'1vw'}} onDragOver={(e) => handleAllowDrop(e)} onDrop={(e) => handleDropCalendar(e)}>
        <FontAwesomeIcon size="2xl" icon={faCalendar} />
    </Col>
    <Col style={{ padding: "3px", backgroundColor: "#9ab6da", borderRadius: "5px", marginLeft:'1vw', marginRight:'1vw', maxWidth:'30vw'}} onDragOver={(e) => handleAllowDrop(e)} onDrop={(e) => handleDropOutline(e)}>
        <Dropdown>
            {activeAiPrompt.length === 0 ? <FontAwesomeIcon size="2xl" icon={faFileWord} /> : <></>}
            <Dropdown.Toggle style={{backgroundColor: "#9ab6da", marginLeft: "10px", maxWidth:'20vw', display: "inline-block", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}} id="dropdown-basic">
                {activeAiPrompt}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{maxWidth:'25vw'}}>
            {Object.keys(aiPrompts)?.map((item, index)=>{
                    return <Container>
                                <Button style={{backgroundColor: "white"}} name={item} key={index} onClick={() => updateActiveAiPrompt(aiPrompts[item])}>
                                    {index + 1}: {aiPrompts[item]}
                                </Button>
                           </Container>
                })}
            {addingPrompt.adding ?
            <Container style={{ paddingTop: "1vh", borderTop: "3px solid rgb(212, 212, 212)"}}>
                <textarea type="text" name="prompt" placeholder="Prompt Name" onChange={(e)=> handleChangeNewPrompt(e)}/>
                <Row>
                    <Dropdown.Item onClick={() => handleSavePrompt(addingPrompt.prompt)}><FontAwesomeIcon size="sm" icon={faFloppyDisk} /></Dropdown.Item>
                    <Dropdown.Item onClick={() => updateAddingPrompt({...addingPrompt, adding: false})}><FontAwesomeIcon size="sm" icon={faX} /></Dropdown.Item>
                </Row>
            </Container>
            :
            <>
            <Dropdown.Item onMouseEnter={() => updateAddingPrompt({...addingPrompt, adding: true})}><FontAwesomeIcon size="sm" icon={faPlus} /> Add</Dropdown.Item>
            </>
            }
            </Dropdown.Menu>
        </Dropdown>
    </Col>
    <Col style={{ padding: "3px", backgroundColor: '#f44336', borderRadius: "5px", marginLeft:'1vw', marginRight:'1vw'}} onDragOver={(e) => handleAllowDrop(e)} onDrop={(e) => handleDropDelete(e)}>
        <FontAwesomeIcon size="2xl" icon={faTrashCan} />
    </Col>
</Navbar>
<Tab.Container id="list-group-tabs" defaultActiveKey="#link1">
    <Row>
        <Col sm={2} className="vh-100 overflow-auto" style={{ maxHeight: "90vh" }}>
            <ListGroup>
            {complianceData?.map((item, index)=>{
                return <OverlayTrigger 
                            placement="right"
                            key={index} 
                            delay={{ show: 250, hide: 400 }} 
                            overlay={
                                <Popover className="custom-pover">
                                    <Popover.Header as="h3" className="custom-pover-header">{`Page #${item.page_number} (Double Click to Edit)`}</Popover.Header>
                                    <Popover.Body className="custom-pover-body">
                                        <img src={item.title} alt={index}/>
                                    </Popover.Body>
                                </Popover>
                            }>
                            <ListGroup.Item className='d-flex justify-content-center' action name={item.id} key={index} href={`#link${index}`} draggable='true' onDragStart={(e) => handleDrag(e)} onDoubleClick={() => handleFocus(item.id)}>
                                <FontAwesomeIcon onClick={() => handleFlagged(item.id)} style={{paddingRight:'1vw'}} color={item.flagged} size="sm" icon={faFlag} />
                                <div>{item.title_text}</div>
                            </ListGroup.Item>
                        </OverlayTrigger>
            })}
            </ListGroup>
        </Col>
        <Col sm={10} className="vh-100 overflow-auto" style={{ maxHeight: "90vh" }}>
            <Tab.Content>
            {complianceData?.map((item, index)=>{
                // return <OverlayTrigger 
                //             placement="bottom"
                //             key={index} 
                //             delay={{ show: 250, hide: 400 }} 
                //             overlay={
                //                 <Popover className="custom-pover">
                //                     <Popover.Header as="h3" className="custom-pover-header">{`Page #${item.page_number}`}</Popover.Header>
                //                     <Popover.Body className="custom-pover-body">
                //                         <img src={item.content.slice(33).split("media")[1]} alt={index}/>
                //                     </Popover.Body>
                //                 </Popover>
                //             }>
                //             <Tab.Pane key={index} eventKey={`#link${index}`}>{item.content_text}</Tab.Pane> 
                //         </OverlayTrigger>
                return <>{ imageMode ? <Tab.Pane key={index} eventKey={`#link${index}`} onClick={() => handleImageMode(false)}>
                                            <img src={item.content} alt={index}/>
                                        </Tab.Pane>
                                     :<Tab.Pane key={index} eventKey={`#link${index}`} onClick={() => handleImageMode(true)}>{item.content_text}</Tab.Pane>}</>
            })}
            </Tab.Content>
        </Col>
    </Row>
</Tab.Container>
</>
//Loading
: runningTrigger ?
<Container>
Leave this page run in the background (~15 minutes for a 50 page document and ~30 minutes for a 100 page document)
<Loading />
</Container>
:
//Initial NOFO Input
<>
<div style={{marginTop: "10px", marginBottom: "10px"}} {...getRootProps({ className: "dropzone" })}>
      <input className="input-zone" name="nofo" {...getInputProps()} />
      <div className="text-center">
        <p className="dropzone-content">
          {acceptedFiles[0] ? files : "Add your PDF NOFO Here" }
        </p>
      </div>
</div>
<Button variant="primary" type="submit" onClick={handleSubmitNofo}>
	Submit
</Button>
</>
:
<Loading />
}

                
</Tab.Pane>
    <Tab.Pane eventKey="#link2">
        Blank
    </Tab.Pane>
    <Tab.Pane eventKey="#link3">
        <Outline textArray={aiData} proposalData={proposalData}/>
    </Tab.Pane>
</Tab.Content>
</Col>
</Row>
</Tab.Container>

:

<Loading />

}

</>);
}

export default ComplianceListV2;