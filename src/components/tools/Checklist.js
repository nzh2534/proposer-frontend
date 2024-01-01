import CsvDownloadButton from "react-json-to-csv";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import axiosInstance from "../../axios";
import InputGroup from "react-bootstrap/InputGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useState } from "react";
import {
    faPlus,
    faFloppyDisk,
    faFileCsv,
    faFlag
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

  const handleDragSection = (e, id) => {
    console.log(id);
    e.dataTransfer.setData("sec_id", id);
  };

  const handleAllowDrop = (e) => {
    e.preventDefault();
  };

  const handleDrag = (e) => {
    console.log(e.target.name);
    e.dataTransfer.setData("name", e.target.name);
  };
   
   
function Checklist({compData, complianceDataOriginal, checkData, pk, proposalTitle, searchInput, updateSearchInput, updateFocusData}) {
    const [complianceData, updateComplianceData] = useState(compData);
    const [checklistData, updateChecklistData] = useState(checkData);

    const handleSaveChecklist = () => {
        var checklistCopy = [...checklistData];
        axiosInstance
          .put(`proposals/${pk}/update/`, {
            title: proposalTitle,
            checklist: checklistCopy,
          })
          .catch((error) => {
            console.log(error.response);
          })
          .then((res) => {
            console.log(res);
            alert(`Compliance Checklist Saved for ${proposalTitle}!`);
          });
      };

    const handleDropSection = async (e) => {
        if (e.dataTransfer.getData("name")) {
          var id = e.dataTransfer.getData("name");
          const cklistcopy = [...checklistData];
          console.log(e.target.name);
          var specificComplianceItem = complianceData.find((item) => {
            return item.id === parseInt(id);
          });
          const objIndex = cklistcopy.findIndex(
            (obj) => obj.id === parseInt(e.target.name),
          );
          cklistcopy[objIndex].data = cklistcopy[objIndex].data.concat(
            specificComplianceItem.content_text,
            "\n",
          );
          cklistcopy[objIndex].pages = cklistcopy[objIndex].pages.concat(
            specificComplianceItem.page_number,
            ", ",
          );
          console.log(cklistcopy);
          updateChecklistData(cklistcopy);
        } else {
          console.log("second");
          var current = parseInt(e.dataTransfer.getData("sec_id"));
          var target = parseInt(e.target.name.split("_")[0]);
          console.log(current); //current
          console.log(target); //target
          const cklistcopy = [...checklistData];
          const newcklist = [];
          if (current > target) {
            cklistcopy.map((item) => {
              if (item.id < target) {
                newcklist.push(item);
              } else if (item.id === current) {
                var itemCopy = { ...item };
                itemCopy.id = target;
                newcklist.push(itemCopy);
              } else if (item.id >= target && item.id < current) {
                var itemCopy = { ...item };
                itemCopy.id += 1;
                newcklist.push(itemCopy);
              } else {
                newcklist.push(item);
              }
            });
            newcklist.sort((a, b) => a.id - b.id);
            console.log(newcklist);
          } else {
            cklistcopy.map((item) => {
              if (item.id < current) {
                newcklist.push(item);
              } else if (item.id === current) {
                var itemCopy = { ...item };
                itemCopy.id = target - 1;
                newcklist.push(itemCopy);
              } else if (item.id > current && item.id < target) {
                var itemCopy = { ...item };
                itemCopy.id -= 1;
                newcklist.push(itemCopy);
              } else {
                newcklist.push(item);
              }
            });
            newcklist.sort((a, b) => a.id - b.id);
            console.log(newcklist);
          }
          updateChecklistData(newcklist);
        }
      };

      const handleAddToChecklist = () => {
        var checklistCopy = [...checklistData];
        var maxId = Math.max(...checklistCopy.map((o) => o.id));
        checklistCopy.push({ item: "", id: maxId + 1, data: "", pages: "" });
        updateChecklistData(checklistCopy);
      };
    
      const handleChecklistChange = (e) => {
        var checklistCopy = [...checklistData];
        const items = e.target.name.split("_");
        const index = checklistCopy.findIndex(
          (obj) => obj.id === parseInt(items[0]),
        );
        checklistCopy[index][items[1]] = e.target.value;
        console.log(checklistCopy);
        updateChecklistData(checklistCopy);
      };

      const handleNofoSearch = (e) => {
        if (e.target.value.toLowerCase().length === 0) {
          updateSearchInput("");
          updateComplianceData(complianceDataOriginal);
        } else {
          updateSearchInput(e.target.value.toLowerCase());
          var complianceDataOriginalCopy = [...complianceDataOriginal];
          const filteredData = complianceDataOriginalCopy.filter((item) => {
            if (item.title_text.toLowerCase().includes(searchInput)) {
              return item;
            }
          });
          updateComplianceData(filteredData);
        }
      };
    
      const handleFocus = (id) => {
        const result = complianceData.find((obj) => {
          return obj.id === parseInt(id);
        });
        const resultCopy = result;
        console.log(result);
        updateFocusData({
          focusing: true,
          data: resultCopy,
        });
      };
    
      const handleFlagged = (id) => {
        const complianceDataCopy = [...complianceData];
        const itemIndex = complianceDataCopy.findIndex((item) => {
          return item.id === parseInt(id);
        });
        if (complianceDataCopy[itemIndex].flagged.includes("white")) {
          complianceDataCopy[itemIndex].flagged = "red";
        } else {
          complianceDataCopy[itemIndex].flagged = "white";
        }
        updateComplianceData(complianceDataCopy);
        axiosInstance
          .put(`proposals/${pk}/compliance/${id}/update/`, {
            proposal: complianceDataCopy[itemIndex].proposal,
            flagged: complianceDataCopy[itemIndex].flagged,
          })
          .catch((error) => {
            console.log(error.response);
          })
          .then((res) => {
            console.log(res);
          });
      };

return (
<Row>
<Col
    sm={4}
    className="vh-100 overflow-auto"
    style={{ maxHeight: "90vh" }}
    >
    <ListGroup>
        <InputGroup className="mb-3">
        <InputGroup.Text>
            NOFO Search
        </InputGroup.Text>
        <Form.Control
            aria-label="search"
            value={searchInput}
            onChange={(e) => handleNofoSearch(e)}
        />
        </InputGroup>
        {complianceData?.map((item, index) => {
        return (
            <OverlayTrigger
            placement="right"
            key={index}
            delay={{ show: 250, hide: 400 }}
            overlay={
                <Popover className="custom-pover">
                <Popover.Header
                    as="h3"
                    className="custom-pover-header"
                >{`Page #${item.page_number} (Double Click to Edit)`}</Popover.Header>
                <Popover.Body className="custom-pover-body">
                    <div>{item.title_text}</div>
                </Popover.Body>
                </Popover>
            }
            >
            {item.content_text.length === 0 ||
            item.content_text === "\f" ? (
                <ListGroup.Item
                className="d-flex justify-content-center bg-dark"
                action
                name={item.id}
                key={index}
                href={`#link${index}`}
                draggable="false"
                onDragStart={(e) => handleDrag(e)}
                onDoubleClick={() =>
                    handleFocus(item.id)
                }
                >
                <FontAwesomeIcon
                    onClick={() =>
                    handleFlagged(item.id)
                    }
                    style={{ marginRight: "2px" }}
                    color={item.flagged}
                    size="sm"
                    icon={faFlag}
                />
                <img
                    src={item.title}
                    name={item.id}
                    alt={index}
                    style={{
                    maxWidth: "50vh",
                    height: "auto",
                    borderRadius: "5px",
                    }}
                />
                </ListGroup.Item>
            ) : (
                <ListGroup.Item
                className="d-flex justify-content-center"
                action
                name={item.id}
                key={index}
                href={`#link${index}`}
                draggable="true"
                onDragStart={(e) => handleDrag(e)}
                onDoubleClick={() =>
                    handleFocus(item.id)
                }
                >
                <FontAwesomeIcon
                    onClick={() =>
                    handleFlagged(item.id)
                    }
                    style={{ marginRight: "2px" }}
                    color={item.flagged}
                    size="sm"
                    icon={faFlag}
                />
                <img
                    src={item.title}
                    name={item.id}
                    alt={index}
                    style={{
                    maxWidth: "50vh",
                    height: "auto",
                    borderRadius: "5px",
                    }}
                />
                </ListGroup.Item>
            )}
            </OverlayTrigger>
        );
        })}
    </ListGroup>
    </Col>
    <Col
      sm={8}
      className="vh-100 d-flex justify-content-center overflow-scroll"
      style={{ maxHeight: "90vh" }}
    >
      <Form style={{ width: "100%" }}>
        <Button
          style={{ marginBottom: "1vh" }}
          onClick={() => handleAddToChecklist()}
        >
          <FontAwesomeIcon
            size="sm"
            icon={faPlus}
          />
        </Button>
        <Button
          style={{
            marginBottom: "1vh",
            marginLeft: "1vh",
            marginRight: "1vh",
          }}
          onClick={() => handleSaveChecklist()}
        >
          <FontAwesomeIcon
            size="sm"
            icon={faFloppyDisk}
          />
        </Button>
        <CsvDownloadButton
          style={{ marginBottom: "1vh" }}
          className="btn btn-primary"
          data={checklistData}
          delimiter=","
        >
          <FontAwesomeIcon
            size="sm"
            icon={faFileCsv}
          />
        </CsvDownloadButton>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Pg.</th>
              <th>Item</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {checklistData?.map((item, index) => {
              return (
                <tr
                  key={index}
                  name={item.id
                    .toString()
                    .concat("_item")}
                >
                  <td style={{ maxWidth: "10vh" }}>
                    <Form.Control
                      name={item.id
                        .toString()
                        .concat("_pages")}
                      as="textarea"
                      value={item.pages}
                      onChange={(e) =>
                        handleChecklistChange(e)
                      }
                    />
                  </td>
                  <td
                    style={{
                      maxWidth: "20vh",
                      cursor: "grab",
                    }}
                    draggable
                    onDragStart={(e) =>
                      handleDragSection(e, item.id)
                    }
                    onDragOver={(e) =>
                      handleAllowDrop(e)
                    }
                    onDrop={(e) =>
                      handleDropSection(e)
                    }
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
                        .concat("_data")}
                      as="textarea"
                      value={item.data}
                      style={{ minWidth: "50vh" }}
                      onDragOver={(e) =>
                        handleAllowDrop(e)
                      }
                      onDrop={(e) =>
                        handleDropSection(e)
                      }
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
      </Form>
    </Col>
    </Row>
    
);
}

export default Checklist; 
