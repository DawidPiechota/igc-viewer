import React, { useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';

import iconPara from "../../../icons/para.svg";
import iconStart from "../../../icons/start.svg";
import iconFinish from "../../../icons/finish.svg";

const containerStyle = {
  position: "absolute",
  top: "0",
  left: "0",
  bottom: "0",
  right: "0",
  width: "100%",
  height: "100%",
};

const options = {
  strokeColor: "rgba(27, 100, 170, 0.856)",
  strokeOpacity: 0.8,
  strokeWeight: 3,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1
};

function GMap({
  pathPoints,
  mapCenter,
  iconPosition,
  ongoingVisualization,
  flightStartEndPos
}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBOkgAJGSMEpDzaqpzfO4e_oSMBXKhtC-Q"
  })

  const [map, setMap] = React.useState(null)
  
  const onLoad = React.useCallback(function callback(map) {
    //const bounds = new window.google.maps.LatLngBounds();
    //map.fitBounds(bounds);
    setMap(map);
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Polyline
          path={pathPoints}
          options={options}
        />
        <Marker
          position={iconPosition}
          visible={ongoingVisualization}
          icon={iconPara}
        />
        <Marker
          position={flightStartEndPos?.start}
          icon={iconStart}
        />
        <Marker
          position={flightStartEndPos?.end}
          icon={iconFinish}
        />
        <></>
      </GoogleMap>
  ) : <></>
}

export default React.memo(GMap)