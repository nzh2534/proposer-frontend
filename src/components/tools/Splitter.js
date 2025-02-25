import React, { useState, useRef } from 'react';
import axiosInstance from '../../axios';
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Loading from '../Loading';
import {
  faArrowLeft,
  faRefresh,
  faObjectUngroup
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Splitter = ({item, refresh, updateSplitMode}) => {
  const [boxes, setBoxes] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [boxId, setBoxId] = useState(1);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);

  const getHierarchy = (title) => {
    const match = title.match(/_(\d+(\.\d+)*)_/);
    return match ? match[1] : '';
  };

  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    const { left, top } = imageRef.current.getBoundingClientRect();
    console.log(clientX - left, clientY - top)
    console.log(imageRef.current.getBoundingClientRect())

    if (!drawing) {
      setStartCoords({ x: clientX - left, y: clientY - top });
      setDrawing(true);
      setBoxId(boxId + 1);
    } else {
      setEndCoords({ x: clientX - left, y: clientY - top });
      setDrawing(false);
      setBoxes([...boxes, { start: { ...startCoords }, end: { ...endCoords }, id: getHierarchy(item.title).concat(".", boxId.toString())}]);
    }
  };

  const handleMouseMove = (e) => {
    if (drawing) {
      const { clientX, clientY } = e;
      const { left, top } = imageRef.current.getBoundingClientRect();
      const adjustedX = Math.max(0, Math.min(clientX - left, imageRef.current.width));
      const adjustedY = Math.max(0, Math.min(clientY - top, imageRef.current.height));

      setEndCoords({ x: adjustedX, y: adjustedY });
    }
  };

  const handleLogCoordinates = (e) => {
    if (boxes.length == 0){
      alert("Place boxes over the image to split")
    } else{
    e.preventDefault();
    setLoading(true);
    let formData = new FormData();
    formData.append("boxes", JSON.stringify(boxes));
    formData.append("baseId", getHierarchy(item.title).concat(".1"));
    formData.append("id", item.id);
    formData.append("proposal", item.proposal);
    formData.append("process", "split")
    axiosInstance
    .post(`proposals/${item.proposal}/compliance/`, formData, {headers: { 'Content-Type': 'multipart/form-data'}})
    .catch((error) => {
      console.log(error.response);
    })
    .then((res) => {
      console.log(res);
      refresh();
      setLoading(false);
      setBoxes([]);
    })}
  };

  return (<>{ loading ? <Loading /> :
    <div>
      <Row className='p-1'>
        <Col>
        <OverlayTrigger
          placement="left"
          delay={{ show: 1000, hide: 50 }}
          overlay={
            <Popover style={{backgroundColor: "#66ab57"}} className="custom-pover">
              <Popover.Body style={{backgroundColor: "white"}} className="custom-pover-body">
                <div>Go back</div>
              </Popover.Body>
            </Popover>
          }>
          <Button><FontAwesomeIcon size="xl" onClick={() => {updateSplitMode({"set": false, "itemRef": {}})}} icon={faArrowLeft} /></Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 1000, hide: 50 }}
          style={{zoom: "67%"}}
          overlay={
            <Popover style={{backgroundColor: "#66ab57"}} className="custom-pover">
              <Popover.Body style={{backgroundColor: "white"}} className="custom-pover-body">
                <div>Click to split this section based on the boxes placed over the image</div>
              </Popover.Body>
            </Popover>
          }>
            <Button style={{marginLeft: "1vw"}} onClick={handleLogCoordinates}><FontAwesomeIcon size="xl" icon={faObjectUngroup} /></Button>
          </OverlayTrigger>
          <OverlayTrigger
          placement="right"
          delay={{ show: 1000, hide: 50 }}
          overlay={
            <Popover style={{backgroundColor: "#66ab57"}} className="custom-pover">
              <Popover.Body style={{backgroundColor: "white"}} className="custom-pover-body">
                <div>Click to remove any boxes placed over the image</div>
              </Popover.Body>
            </Popover>
          }>
            <Button style={{marginLeft: "1vw"}} onClick={()=>{setBoxes([]); setBoxId(0)}}><FontAwesomeIcon size="xl" icon={faRefresh} /></Button>
          </OverlayTrigger>
        </Col>
      </Row>
      <div
        style={{ position: 'relative', display: 'inline-block' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <img
          ref={imageRef}
          src={item.content}
          style={{ cursor: "crosshair", border: "10px solid #66ab57", borderRadius: "15px"}}
        />

        {drawing && (
          <div
            style={{
              position: 'absolute',
              border: '2px dashed #66ab57',
              pointerEvents: 'none',
              left: startCoords.x,
              top: startCoords.y,
              width: endCoords.x - startCoords.x,
              height: endCoords.y - startCoords.y,
            }}
          />
        )}

        {boxes.map((box, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              border: '2px dashed #708090',
              left: box.start.x,
              top: box.start.y,
              width: box.end.x - box.start.x,
              height: box.end.y - box.start.y,
            }}
          />
        ))}
      </div>
    </div>
          }</>);
};

export default Splitter;
