import React, { useState, useRef } from 'react';
import axiosInstance from '../../axios';
import Button from "react-bootstrap/Button";

const Splitter = ({item, alt}) => {
  const [boxes, setBoxes] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [boxId, setBoxId] = useState(1);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
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
    e.preventDefault();
    let formData = new FormData();
    formData.append("boxes", JSON.stringify(boxes));
    formData.append("baseId", getHierarchy(item.title).concat(".1"));
    formData.append("id", item.id);
    formData.append("proposal", item.proposal);
    axiosInstance
    .post(`proposals/${item.proposal}/compliance/`, formData, {headers: { 'Content-Type': 'multipart/form-data'}})
    .catch((error) => {
      console.log(error.response);
    })
    .then((res) => {
      console.log(res);
    })
  };

  return (
    <div style={{backgroundColor: "gray"}}>
      <div>
        <Button onClick={()=>{setBoxes([]); setBoxId(0)}}>Reset Boxes</Button>
        <Button style={{marginLeft: "5vw"}} onClick={handleLogCoordinates}>Split</Button>
      </div>
      <div
        style={{ position: 'relative', display: 'inline-block' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <img
          ref={imageRef}
          src={item.content}
          alt={alt}
          style={{ width: '100%', height: 'auto', cursor: "crosshair"}}
        />

        {drawing && (
          <div
            style={{
              position: 'absolute',
              border: '2px dashed red',
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
              border: '2px dashed blue',
              left: box.start.x,
              top: box.start.y,
              width: box.end.x - box.start.x,
              height: box.end.y - box.start.y,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Splitter;
