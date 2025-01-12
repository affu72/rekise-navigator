import { useState } from "react";
import DrawButton from "./components/DrawButton";
import MissionModal from "./components/MissionModal";
import MapComponent from "./components/Map";

function App() {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingType, setDrawingType] = useState("LineString");
  const [coordinates, setCoordinates] = useState([]);
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [isPolygonMode, setIsPolygonMode] = useState(false);
  const [insertionPoint, setInsertionPoint] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleStartDrawing = () => {
    setIsDrawingMode(true);
  };

  const handleStartPolygon = (index, position) => {
    setDrawingType("Polygon");
    setIsPolygonMode(true);
    setIsDrawingMode(true);
    setInsertionPoint({ index, position });
  };

  const handleCoordinatesUpdate = (newCoordinates) => {
    if (drawingType === "LineString") {
      setCoordinates(newCoordinates);
    } else {
      setPolygonCoordinates(newCoordinates[0]); // For polygon, first array is outer ring
    }
    setIsDrawingMode(false);
  };

  const handleImportPolygon = () => {
    // Connect polygon with linestring
    const newCoordinates = [...coordinates];
    const insertIndex =
      insertionPoint.position === "after"
        ? insertionPoint.index + 1
        : insertionPoint.index;

    // Insert polygon coordinates at the specified position
    newCoordinates.splice(
      insertIndex,
      0,
      ...polygonCoordinates,
      polygonCoordinates[0] // Close the polygon by returning to start
    );

    // Update state
    setCoordinates(newCoordinates);
    setPolygonCoordinates([]);
    setIsPolygonMode(false);
    setDrawingType("LineString");
    setInsertionPoint(null);
  };

  return (
    <div className='app'>
      <DrawButton onClick={() => setShowModal(true)} />

      {showModal && (
        <MissionModal
          onStartDrawing={handleStartDrawing}
          onStartPolygon={handleStartPolygon}
          coordinates={coordinates}
          polygonCoordinates={polygonCoordinates}
          isPolygonMode={isPolygonMode}
          onImportPolygon={handleImportPolygon}
          onClose={() => setShowModal(false)}
        />
      )}

      <MapComponent
        isDrawingMode={isDrawingMode}
        drawingType={drawingType}
        onCoordinatesUpdate={handleCoordinatesUpdate}
      />
    </div>
  );
}

export default App;
