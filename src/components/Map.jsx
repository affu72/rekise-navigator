import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import { Draw } from "ol/interaction";
import { fromLonLat } from "ol/proj";

const MapComponent = ({
  isDrawingMode,
  drawingType = "LineString",
  onCoordinatesUpdate,
}) => {
  const mapRef = useRef();
  const mapInstanceRef = useRef(null);
  const vectorSourceRef = useRef(new VectorSource());
  const drawInteractionRef = useRef(null);

  useEffect(() => {
    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (isDrawingMode) {
      const draw = new Draw({
        source: vectorSourceRef.current,
        type: drawingType,
      });

      draw.on("drawend", (event) => {
        const coordinates = event.feature.getGeometry().getCoordinates();
        onCoordinatesUpdate(coordinates);
      });

      const handleKeyPress = (event) => {
        if (event.key === "Enter" && draw) {
          draw.finishDrawing();
        }
      };

      document.addEventListener("keydown", handleKeyPress);
      mapInstanceRef.current.addInteraction(draw);
      drawInteractionRef.current = draw;

      return () => {
        document.removeEventListener("keydown", handleKeyPress);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeInteraction(draw);
        }
      };
    } else {
      if (drawInteractionRef.current) {
        mapInstanceRef.current.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
      }
    }
  }, [isDrawingMode, drawingType, onCoordinatesUpdate]);

  return <div ref={mapRef} style={{ width: "100%", height: "90vh" }} />;
};

export default MapComponent;
