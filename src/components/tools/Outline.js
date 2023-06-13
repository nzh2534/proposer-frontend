import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/esm/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { useEffect, useState } from 'react';
import { GoogleLogin} from '@react-oauth/google';
import { gapi } from 'gapi-script';
import axiosInstance from '../../axios';
import { GoogleOAuthProvider } from '@react-oauth/google';

const API_KEY = process.env.REACT_APP_API_GOOGLE_KEY

function Outline({textArray, proposalData}) {
    var testHeader = "\nCOVER PAGE"
    var instructionText = "\n\nINSTRUCTIONS FOR THIS DOCUMENT:\n(1) All highlighted text should eventually be deleted\n"
    const [googleLoggedIn, updateGoogleLoggedIn] = useState(false);  
    const [sectionCountArr, updateSectionCountArr] = useState([]);
    const [outlineContent, updateOutlineContent] = useState(false);
    const [documentId, updateDocumentId] = useState(proposalData.proposal_id);
    const [documentLink, updateDocumentLink] = useState(proposalData.proposal_link);
    const [headerId, updateHeaderId] = useState("");
    const [documentIndex, updateDocumentIndex] = useState(testHeader.length + instructionText.length + 1);
    const [requests, updateRequests] = useState(
        [
            // {
            //     createHeader: {
            //         type: "DEFAULT",
            //         sectionBreakLocation: {index:0}
            //       },
            // },
            // {
            //     createFooter: {
            //         type: "DEFAULT"
            //       }
            // },
            {
                insertText: {
                    text: testHeader,
                    location: {
                    index: 1,
                    },
                },
            },
            {
                insertText: {
                    text: instructionText,
                    location: {
                    index: testHeader.length + 1,
                    },
                },
            },
        ])

    const onSuccess = (res) => {
        console.log("Login Success!")
        updateGoogleLoggedIn(res);
        gapi.load('client:auth2', start);
    }

    const onFailure = (res) => {
        console.log("Login Failed!")
    }

    function start(){
        console.log(gapi)
        gapi.client.init({
            apiKey: process.env.REACT_APP_API_GOOGLE_KEY,
            clientId: process.env.REACT_APP_CLIENT_ID,
            scope: process.env.REACT_APP_SCOPES_GOOGLE
        })
        console.log(gapi)
    };

    useEffect(() => {
        gapi.load('client:auth2', start);
    })

    const createFile = () => {
        var accessToken = gapi.auth.getToken().access_token;
        var body = {title: "GAPI COPY"};
        var request = gapi.client.request({
            'path': process.env.REACT_APP_TEMPLATE_PATH,
            'method': 'POST'
            });

        request.execute(function(resp) {
            updateDocumentId(resp.id)

            axiosInstance
                .put(`proposals/${proposalData.pk}/update/`, {
                    title: proposalData.title,
                    proposal_id: resp.id
                })
                .catch((error) => {
                    console.log(error.response)
                })
                .then((res) => {
                    console.log(res)
                });
            console.log('Copy ID: ' + resp.id);

            fetch(`https://docs.googleapis.com/v1/documents/${resp.id}`, {
            method: "GET",
            headers: new Headers({
                'Authorization': 'Bearer ' + accessToken
            }),
            }).then( (res)=> {
                return res.json();
            }).then(function(val){
                console.log(val)
                console.log(Object.keys(val.headers)[1])
                updateHeaderId(Object.keys(val.headers))
        });
        });

    }

    const updateFile = (requests) => {
        var accessToken = gapi.auth.getToken().access_token;

        fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate?key=${API_KEY}`, {
            method: "POST",
            headers: new Headers({
                'Authorization': 'Bearer ' + accessToken,
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                requests: requests,
              }),
        }).then( (res)=> {
            return res.json();
        })
        .then((val) => {
            fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate?key=${API_KEY}`, {
            method: "POST",
            headers: new Headers({
                'Authorization': 'Bearer ' + accessToken,
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                requests: [
                    {
                        insertText: {
                            text: proposalData.title,
                            location: {
                            segmentId: headerId[0],
                            index: 0,
                            },
                        },
                    },
                    // {
                    //     insertInlineImage: {
                    //         uri: "https://drive.google.com/uc?export=view&id=1p72vX9rbU0zuNRkuXNnUNpCXUkcWfvBX",
                    //         objectSize: {
                    //             height: {
                    //                 magnitude: 60,
                    //                 unit: "PT"
                    //             },
                    //             width: {
                    //                 magnitude: 120,
                    //                 unit: "PT"
                    //             },
                    //         },
                    //         endOfSegmentLocation: {
                    //         segmentId: val.replies[0].createHeader.headerId
                    //         },
                    //     },
                    // },
                    // {
                    //     updateTextStyle: {
                    //       textStyle: {
                    //         italic: true,
                    //         fontSize: {magnitude: 11, unit: 'PT'},
                    //         weightedFontFamily: {fontFamily: 'Times New Roman', weight: 400}
                    //       },
                    //       fields: "*",
                    //       range: {
                    //         segmentId: val.replies[0].createHeader.headerId,
                    //         startIndex: 0,
                    //         endIndex: proposalData.title.length + 1,
                    //       },
                    //     },
                    // },
                    // {
                    //     insertText: {
                    //         text: "Use or disclosure of data contained on this sheet is subject to the restriction on the title page of this application.",
                    //         location: {
                    //         segmentId: val.replies[1].createFooter.footerId,
                    //         index: 0,
                    //         },
                    //     },
                    // },
                    // {
                    //     updateTextStyle: {
                    //       textStyle: {
                    //         italic: true,
                    //         fontSize: {magnitude: 9, unit: 'PT'},
                    //         weightedFontFamily: {fontFamily: 'Times New Roman', weight: 400}
                    //       },
                    //       fields: "*",
                    //       range: {
                    //         segmentId: val.replies[1].createFooter.footerId,
                    //         startIndex: 0,
                    //         endIndex: "Use or disclosure of data contained on this sheet is subject to the restriction on the title page of this application.".length + 1,
                    //       },
                    //     },
                    // },
                ],
              }),
        });
    })
}

const onSectionCountSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target),
          formDataObj = Object.fromEntries(formData.entries())
    console.log(formDataObj)
    let sectionsArr = [];
    let outlineContentSections = {}
    for (var i = parseInt(formDataObj.sections); i > 0; i--) {
        sectionsArr.push(i)
        outlineContentSections[i] = {}
    }
    updateSectionCountArr(sectionsArr.reverse())
    updateOutlineContent(outlineContentSections)
  }

const onProposalOutlineSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target),
          formDataObj = Object.fromEntries(formData.entries())
    let newRequests = [{
        insertSectionBreak: {
            sectionType: "NEXT_PAGE",
            location: {
            index: documentIndex
            }
          },
    }];
    sectionCountArr.forEach((item)=>{
        if(item > 1){
            var pagesInSection = formDataObj[`${item}_pages`]
            newRequests.push(
                {
                    insertText: {
                        text: formDataObj[`${item}_name`],
                        location: {
                        index: documentIndex,
                        },
                    },
                },
            );
            let contentsArr = Object.keys(outlineContent[item])
            contentsArr.forEach((index)=>{
                newRequests.push(
                    {
                        insertText: {
                            text: ("\n" + textArray[index - 1]),
                            location: {
                            index: documentIndex,
                            },
                        },
                    },
                );
            })
            if(pagesInSection === 1){
                newRequests.push(
                    {
                        insertSectionBreak: {
                            sectionType: "NEXT_PAGE",
                            location: {
                            index: documentIndex
                            }
                          },
                    },
                );
            } else {
                for(let i = pagesInSection; i > 1; i--){
                    newRequests.push(
                        {
                            insertPageBreak: {
                                location: {
                                index: documentIndex
                                }
                              },
                        },
                    );
                };
                newRequests.push(
                    {
                        insertSectionBreak: {
                            sectionType: "NEXT_PAGE",
                            location: {
                            index: documentIndex
                            }
                          },
                 });
            }
        }
    });
    let finalRequests = [...requests];
    newRequests.reverse().forEach((item)=>{
        finalRequests.push(item)
    });
    updateRequests(finalRequests);
    updateFile(finalRequests);
    let finalOutlineLink = `https://docs.google.com/document/d/${documentId}`;
    updateDocumentLink(finalOutlineLink);

    axiosInstance
        .put(`proposals/${proposalData.pk}/update/`, {
            title: proposalData.title,
            proposal_link: finalOutlineLink
        })
        .catch((error) => {
            console.log(error.response)
        })
        .then((res) => {
            console.log(res)
        });
  }

const handleDrag = (e) => {
   e.dataTransfer.setData('name', e.target.name);
   e.dataTransfer.setData('id', e.target.id);
}

const handleAllowDrop = (e) => {
    e.preventDefault();
}

const handleDropContent = (e) => {
    const content = e.dataTransfer.getData('name');
    const id = parseInt(e.dataTransfer.getData('id')) + 1;
    let previousContent = outlineContent
    console.log(id) //which item in list
    console.log(e.target.name.split("_")[0]) //which section
    if(e.target.name.split("_")[0] in previousContent){
        previousContent[e.target.name.split("_")[0]][id] = content
    }else{
        let newDict = {}
        newDict[id] = content
        previousContent[e.target.name.split("_")[0]] = newDict
    }
    console.log(previousContent)
    updateOutlineContent(previousContent)
}


return (<Row>
<Col sm={2} className="vh-100 overflow-auto d-flex align-items-center justify-content-center" style={{borderRight: '5px solid gray'}}>
{googleLoggedIn ? 
    <div className="vh-100 d-flex flex-column">
        {/* <Button onClick={() => googleLogout()} id="signOutButton" className='m-3'>
            {/* <googleLogout
                clientId={CLIENT_ID}
                buttonText="Logout"
                onLogoutSuccess={() => onSuccess(false)}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            /> */}
            {/* Sign Out
        </Button> */}
    
    {documentId.length === 0 ? 
    <Button className='customBtn m-3' onClick={() => createFile()}>Create Doc</Button>
    : 
    <>{documentLink.length === 0 ?

        <>{ sectionCountArr.length === 0 ?
            <Form onSubmit={(e) => onSectionCountSubmit(e)} className='m-3'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Initiate Proposal Outline Creation</Form.Label>
                <Form.Control type="number" name="sections" placeholder="Enter number of sections (integers only)" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            : 
            <Form onSubmit={(e) => onProposalOutlineSubmit(e)}>
            {sectionCountArr.map((item, index)=>{
                return(
                <Form.Group className="mb-3" controlId={item}>
                    <Form.Label>{`Section ${item} Name`}</Form.Label>
                    <Form.Control type="text" name={`${item}_name`} placeholder={`Enter Section #${item}`} />
                    <Form.Control type="number" name={`${item}_pages`} placeholder={`Enter Page #${item}`} />
                    <Form.Control disabled onDragOver={(e) => handleAllowDrop(e)} onDrop={(e) => handleDropContent(e)} name={`${item}_content`} placeholder={Object.keys(outlineContent[item]).toString()}/>
                </Form.Group>)
            })}
            <Button variant="primary" type="submit">
                Submit
            </Button>
            </Form>
            }
            </>

    : 
        <Button className="m-2" target="_blank" rel="noopener noreferrer" href={documentLink}>Proposal Outline Link</Button>

    }</>
    }</div>

    : 

    <div id='signInButton'>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
        <GoogleLogin
            onSuccess={credentialResponse => {
                onSuccess(true);
            }}
            onError={() => {
                onFailure()
                console.log('Login Failed');
            }}
        />
        </GoogleOAuthProvider>
    </div>
    }
</Col>
{documentLink.length === 0 ?
<Col sm={10} className="vh-100 overflow-auto">
        {textArray.map((item, index)=>{
            return <ListGroup className='m-2'>
                        <ListGroup.Item action name={item} key={index} id={index} href={`#link${index}`} draggable='true' onDragStart={(e) => handleDrag(e)}>
                            <div>{index + 1}</div>{item}
                        </ListGroup.Item>
                   </ListGroup>
        })}
</Col>
:
<Col sm={10} className="vh-100 overflow-auto">
        Your Google Document Has Been Created (Click to Link Button on the Left)
</Col>
}
</Row>
);
}

export default Outline;