import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";

const MapComponent = ({ drawMode, onCoordinatesUpdate }) => {
  const mapRef = useRef();

  useEffect(() => {
    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: VectorSource.current,
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    return () => initialMap.setTarget(undefined);
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "90vh" }} />;
};

export default MapComponent;
