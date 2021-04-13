import React, { useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Polyline } from '@react-google-maps/api';

const containerStyle = {
  position: "absolute",
  top: "0",
  left: "0",
  bottom: "0",
  right: "0",
  width: "100%",
  height: "100%",
};

const center = {
  lat: 52,
  lng: 19.6
};

const path = [
  {lat: 37.772, lng: -122.214},
  {lat: 21.291, lng: -157.821},
  {lat: -18.142, lng: 178.431},
  {lat: -27.467, lng: 153.027}
];

const options = {
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1
};

function GMap({pathPoints}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: ""
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

  useEffect(() => {
    if(map) {
      map.setCenter({lat: pathPoints[0]?.lat, lng: pathPoints[0]?.lng});
    }
  },[pathPoints])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Polyline
          path={pathPoints}
          options={options}
        />
        <></>
      </GoogleMap>
  ) : <></>
}

export default React.memo(GMap)