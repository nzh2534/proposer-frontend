import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import axiosInstance from "../../axios";
import GoogleButton from "react-google-button";
import { OverlayTrigger, Popover } from "react-bootstrap";

const API_KEY = process.env.REACT_APP_API_GOOGLE_KEY;

function Outline({ checklistData, proposalData }) {
  var testHeader = " ";
  var instructionText =
    "\n\nINSTRUCTIONS FOR THIS DOCUMENT:\n(1) All highlighted text should eventually be deleted\n";
  const [googleLoggedIn, updateGoogleLoggedIn] = useState(false);
  const [authCred, updateAuthCred] = useState("");
  const [tokenClient, setTokenClient] = useState({});
  const [sectionCountArr, updateSectionCountArr] = useState([]);
  const [outlineContent, updateOutlineContent] = useState(false);
  const [documentId, updateDocumentId] = useState(proposalData.proposal_id);
  const [documentLink, updateDocumentLink] = useState(
    proposalData.proposal_link,
  );
  const [headerId, updateHeaderId] = useState("");
  const [documentIndex, updateDocumentIndex] = useState(
    testHeader.length,
  );
  const [requests, updateRequests] = useState([
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
    // {
    //   insertText: {
    //     text: instructionText,
    //     location: {
    //       index: testHeader.length + 1,
    //     },
    //   },
    // },
  ]);

  function start() {
    gapi.client.init({
      apiKey: process.env.REACT_APP_API_GOOGLE_KEY,
      clientId: process.env.REACT_APP_CLIENT_ID,
      scope: process.env.REACT_APP_SCOPES_GOOGLE,
    });
  }

  function handleCallbackResponse() {
    console.log("init");
  }

  useEffect(() => {
    /* global google */
    const google = window.google;
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_CLIENT_ID,
      callback: handleCallbackResponse,
    });

    //tokenClient
    setTokenClient(
      google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_CLIENT_ID,
        scope: process.env.REACT_APP_SCOPES_GOOGLE,
        callback: (tokenResponse) => {
          updateGoogleLoggedIn(true);
          updateAuthCred(tokenResponse.access_token);
        },
      }),
    );

    gapi.load("client:auth2", start);
  }, []);

  const createFile = () => {
    // var accessToken = gapi.auth.getToken().access_token;
    // var body = {title: "GAPI COPY"};

    var request = gapi.client.request({
      path: process.env.REACT_APP_TEMPLATE_PATH,
      method: "POST",
    });

    console.log(request)

    request.execute(function (resp) {
      updateDocumentId(resp.id);

      axiosInstance
        .put(`proposals/${proposalData.pk}/update/`, {
          title: proposalData.title,
          proposal_id: resp.id,
        })
        .catch((error) => {
          console.log(error.response);
          updateGoogleLoggedIn(false);
        })
        .then((res) => {
          console.log(res);
        });

      fetch(`https://docs.googleapis.com/v1/documents/${resp.id}`, {
        method: "GET",
        headers: new Headers({
          Authorization: "Bearer " + authCred,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then(function (val) {
          updateHeaderId(Object.keys(val.headers));
        });
    });
  };

  const updateFile = (requests) => {
    // var accessToken = gapi.auth.getToken().access_token;
    fetch(
      `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate?key=${API_KEY}`,
      {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + authCred,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          requests: requests,
        }),
      },
    )
      .then((res) => {
        return res.json();
      })
      .catch((error) => {
        console.log(error.response);
        updateGoogleLoggedIn(false);
      })
      .then((val) => {
        fetch(
          `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate?key=${API_KEY}`,
          {
            method: "POST",
            headers: new Headers({
              Authorization: "Bearer " + authCred,
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
          },
        );
      });
  };

  const onSectionCountSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    let sectionsArr = [];
    let outlineContentSections = {};
    for (var i = parseInt(formDataObj.sections); i > 0; i--) {
      sectionsArr.push(i);
      outlineContentSections[i] = {};
    }
    updateSectionCountArr(sectionsArr.reverse());
    updateOutlineContent(outlineContentSections);
  };

  const onProposalOutlineSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());
    let newRequests = [
      // {
      //   insertSectionBreak: {
      //     sectionType: "NEXT_PAGE",
      //     location: {
      //       index: documentIndex,
      //     },
      //   },
      // },
    ];
    sectionCountArr.forEach((item) => {
        var pagesInSection = formDataObj[`${item}_pages`];
        newRequests.push({
          insertText: {
            text: formDataObj[`${item}_name`],
            location: {
              index: documentIndex,
            },
          },
        });
        let contentsArr = Object.keys(outlineContent[item]);
        contentsArr.forEach((index) => {
          newRequests.push({
            insertText: {
              text: "\n" + checklistData[index - 1].data,
              location: {
                index: documentIndex,
              },
            },
          });
        });
        if (pagesInSection === 1) {
          newRequests.push({
            insertSectionBreak: {
              sectionType: "NEXT_PAGE",
              location: {
                index: documentIndex,
              },
            },
          });
        } else {
          for (let i = pagesInSection; i > 1; i--) {
            newRequests.push({
              insertPageBreak: {
                location: {
                  index: documentIndex,
                },
              },
            });
          }
          newRequests.push({
            insertSectionBreak: {
              sectionType: "NEXT_PAGE",
              location: {
                index: documentIndex,
              },
            },
          });
        }
      });
    newRequests.pop();
    let finalRequests = [...requests];
    newRequests.reverse().forEach((item) => {
      finalRequests.push(item);
    });
    updateRequests(finalRequests);
    updateFile(finalRequests);
    let finalOutlineLink = `https://docs.google.com/document/d/${documentId}`;
    updateDocumentLink(finalOutlineLink);

    axiosInstance
      .put(`proposals/${proposalData.pk}/update/`, {
        title: proposalData.title,
        proposal_link: finalOutlineLink,
      })
      .catch((error) => {
        console.log(error.response);
      })
      .then((res) => {
        console.log(res);
      });
  };

  const handleDrag = (e) => {
    e.dataTransfer.setData("name", e.target.name);
    e.dataTransfer.setData("id", e.target.id);
  };

  const handleAllowDrop = (e) => {
    e.preventDefault();
  };

  const handleDropContent = (e) => {
    const content = e.dataTransfer.getData("name");
    const id = parseInt(e.dataTransfer.getData("id")) + 1;
    console.log(content);
    console.log(id);
    let previousContent = { ...outlineContent };
    console.log(id); //which item in list
    console.log(e.target.name.split("_")[0]); //which section
    if (e.target.name.split("_")[0] in previousContent) {
      previousContent[e.target.name.split("_")[0]][id] = content;
    } else {
      let newDict = {};
      newDict[id] = content;
      previousContent[e.target.name.split("_")[0]] = newDict;
    }
    console.log(previousContent);
    updateOutlineContent(previousContent);
  };
  return (
    <Row>
      <Col
        sm={4}
        className="overflow-auto d-flex align-items-center justify-content-center"
      >
        {googleLoggedIn ? (
          <div className="vh-100 d-flex flex-column">
            {documentId.length === 0 ? (
              <Button className="customBtn m-3" onClick={() => createFile()}>
                Create Doc
              </Button>
            ) : (
              <>
                {documentLink.length === 0 ? (
                  <>
                    {sectionCountArr.length === 0 ? (
                      <Form
                        onSubmit={(e) => onSectionCountSubmit(e)}
                        className="m-3"
                      >
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>
                            Initiate Proposal Outline Creation
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="sections"
                            placeholder="Enter number of sections"
                          />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                          Submit
                        </Button>
                      </Form>
                    ) : (
                      <Form onSubmit={(e) => onProposalOutlineSubmit(e)}>
                        {sectionCountArr.map((item, index) => {
                          return (
                            <Form.Group
                              className="mb-3"
                              key={index}
                              controlId={item}
                            >
                              <Form.Label>{`Section ${item} Name`}</Form.Label>
                              <Form.Control
                                type="text"
                                name={`${item}_name`}
                                placeholder={`Enter Section #${item}`}
                              />
                              <Form.Control
                                type="number"
                                name={`${item}_pages`}
                                placeholder={`Enter Page #${item}`}
                              />
                              <OverlayTrigger
                                placement="right"
                                delay={{ show: 200, hide: 50 }}
                                overlay={
                                  <Popover style={{backgroundColor: "#66ab57"}} className="custom-pover">
                                    <Popover.Body style={{backgroundColor: "white"}} className="custom-pover-body">
                                      <div>Drag and Drop the sections to the right over this area to include in the document outline. Add more sections to the right by updating and saving the checklist in the Checklist tab.</div>
                                    </Popover.Body>
                                  </Popover>
                                }>
                                  <Form.Control
                                disabled
                                onDragOver={(e) => handleAllowDrop(e)}
                                onDrop={(e) => handleDropContent(e)}
                                name={`${item}_content`}
                                placeholder="No Content Specified"
                                value={Object.keys(
                                  outlineContent[item],
                                ).toString()}
                              />
                              </OverlayTrigger>
                            </Form.Group>
                          );
                        })}
                        <Button variant="primary" type="submit">
                          Submit
                        </Button>
                      </Form>
                    )}
                  </>
                ) : (
                  <Button
                    className="m-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={documentLink}
                  >
                    Proposal Outline Link
                  </Button>
                )}
              </>
            )}
          </div>
        ) : (
          <div id="signInButton">
            <GoogleButton
              style={{ width: "50px", marginBottom: "20vh" }}
              onClick={() => tokenClient.requestAccessToken()}
            />
          </div>
        )}
      </Col>
      {documentLink.length === 0 ? (
        <Col sm={8} className="overflow-auto" style={{height: "130vh", zoom:"67%"}}>
          {checklistData.length === 0 ? <div>Text Data Added to the Checklist Tab will Appear here</div>: <>{checklistData.map((item, index) => {
            return (<>{ (item.data.length > 0) ?
              <ListGroup className="m-2" key={index}>
                <ListGroup.Item
                  action
                  name={item.id}
                  id={index}
                  href={`#link${index}`}
                  draggable="true"
                  onDragStart={(e) => handleDrag(e)}
                >
                  <div style={{fontWeight: "bold"}}>{`(${index + 1}) ${item.item}`}`</div>
                  {item.data} 
                </ListGroup.Item>
              </ListGroup>
              :
              <></>
            }</>);
          })}</>}
        </Col>
      ) : (
        <Col sm={8} className="vh-100 overflow-auto mt-1">
          <div>
          Your Google Document Has Been Created (Click to Link Button on the
          Left)
          </div>
        </Col>
      )}
    </Row>
  );
}

export default Outline;
