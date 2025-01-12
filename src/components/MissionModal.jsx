import React, { useRef, useState } from "react";
import { transform } from "ol/proj";
import { getDistance } from "ol/sphere";
import DropdownMenu from "./DropdownMenu";
import { useDraggable } from "../hooks/useDraggable";
import { IoMdClose, IoMdRemove, IoMdAdd } from "react-icons/io";
import styles from "./MissionModal.module.css";

const MissionModal = ({
  onStartDrawing,
  coordinates,
  onStartPolygon,
  polygonCoordinates,
  isPolygonMode,
  onImportPolygon,
  onClose,
}) => {
  const modalRef = useRef(null);
  const { position } = useDraggable(modalRef);
  const [isMinimized, setIsMinimized] = useState(false);

  const formatCoordinates = (coord) => {
    if (!coord) return "";
    const [lon, lat] = transform(coord, "EPSG:3857", "EPSG:4326");
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  };

  const calculateDistance = (coord1, coord2) => {
    if (!coord1 || !coord2) return "-";
    const point1 = transform(coord1, "EPSG:3857", "EPSG:4326");
    const point2 = transform(coord2, "EPSG:3857", "EPSG:4326");
    const distance = getDistance(point1, point2);
    return `${Math.round(distance)}`;
  };

  const renderTable = (points, prefix = "WP", showActions = false) => (
    <div className={styles.tableContainer}>
      <table className={styles.coordinatesTable}>
        <thead>
          <tr>
            <th>{prefix}</th>
            <th>Coordinates</th>
            <th>Distance (m)</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {points.map((coord, index) => (
            <tr key={index}>
              <td className={styles.wpCell}>
                {prefix}
                {String(index).padStart(2, "0")}
              </td>
              <td className={styles.coordCell}>{formatCoordinates(coord)}</td>
              <td className={styles.distanceCell}>
                {index > 0 ? calculateDistance(points[index - 1], coord) : "-"}
              </td>
              {showActions && (
                <td className={styles.actionCell}>
                  <DropdownMenu
                    onInsertBefore={() => onStartPolygon(index, "before")}
                    onInsertAfter={() => onStartPolygon(index, "after")}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div
      ref={modalRef}
      className={`${styles.modal} ${isMinimized ? styles.minimized : ""}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <div className={`${styles.header} modal-header`}>
        <h2>{isPolygonMode ? "Polygon Creation" : "Mission Creation"}</h2>
        <div className={styles.headerButtons}>
          <button
            className={styles.controlButton}
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <IoMdAdd /> : <IoMdRemove />}
          </button>
          <button
            className={styles.controlButton}
            onClick={onClose}
            title='Close'
          >
            <IoMdClose />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className={styles.content}>
            <h3>
              {isPolygonMode ? "Polygon Waypoints" : "Waypoint Navigation"}
            </h3>

            {isPolygonMode ? (
              // Polygon View
              <>
                {polygonCoordinates.length === 0 ? (
                  <p className={styles.instruction}>
                    Click on the map to draw polygon points and press ↵ to
                    complete
                  </p>
                ) : (
                  <>
                    {renderTable(polygonCoordinates, "P")}
                    <div className={styles.footer}>
                      <button
                        className={styles.generateButton}
                        onClick={onImportPolygon}
                      >
                        Import Points
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              // LineString View
              <>
                {coordinates.length === 0 ? (
                  <p className={styles.instruction}>
                    Click on the map to mark points of the route and then press
                    ↵ to complete the route
                  </p>
                ) : (
                  renderTable(coordinates, "WP", true)
                )}
              </>
            )}
          </div>

          {coordinates.length === 0 && !isPolygonMode && (
            <div className={styles.footer}>
              <button
                className={styles.generateButton}
                onClick={onStartDrawing}
              >
                Generate Data
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MissionModal;
