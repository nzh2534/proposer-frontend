import React, { useState, useRef } from 'react';

const Splitter = ({src, alt}) => {
  const [boxes, setBoxes] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    const { left, top } = imageRef.current.getBoundingClientRect();

    if (!drawing) {
      setStartCoords({ x: clientX - left, y: clientY - top });
      setDrawing(true);
    } else {
      setEndCoords({ x: clientX - left, y: clientY - top });
      setDrawing(false);
      setBoxes([...boxes, { start: { ...startCoords }, end: { ...endCoords } }]);
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

  const handleLogCoordinates = () => {
    console.log('Bounding Box Coordinates:', boxes.map(box => ({
      startY: box.start.y,
      startX: box.start.x,
      endY: box.end.y,
      endX: box.end.x,
    })));
  };

  return (
    <div>
      <button onClick={()=>setBoxes([])}>Reset</button>
      <button onClick={handleLogCoordinates}>Log Coordinates</button>
      <div
        style={{ position: 'relative', display: 'inline-block' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
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
