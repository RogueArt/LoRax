import React, { useState } from 'react'
import { GoogleApiWrapper, Circle, Map } from "google-maps-react";
import PropTypes from 'prop-types'
import mapStyle from '../styles/mapStyles/dark.js'

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

const testCoordinates = [
      { lat: 37.77, lng: -122.42 },
      { lat: 37.775, lng: -122.425 },
      { lat: 36.73, lng: -122.44 },
      { lat: 36.75, lng: -122.42 }
]



export function MapContainer({ google }) {
  // function onInfoWindowClose() {
  // //   setSelectedPlace({ name: '' })
  // // }

  // const [selectedPlace, setSelectedPlace] = useState({ name: '' })
  
  /* eslint-disable */
  const [markerCoordinates, setMarkerCoordinates] = useState(testCoordinates)
  /* eslint-disable */
  const [initialPosition, setInitialPosition] = useState({ lat: 37.77, lng: -122.42 })

  return (
      <Map initialCenter={{ lat: 37.77, lng: -122.42 }}
        google={google} 
        zoom={17} 
        containerStyle={{width: '100%', height: '180px', position: 'relative'}}
        onReady={(mapProps, map) => map.setOptions({ styles: mapStyle })}  
      >
        
        {generateMarkers(markerCoordinates)}

        {/* <InfoWindow onClose={onInfoWindowClose}>
            <div>
              <h1>{selectedPlace.name}</h1>
            </div>
        </InfoWindow> */}
      </Map>
    );
}

function generateCircleCenter(lat, lng, idx) {
  return <Circle
    key={idx}
    center={{ lat, lng }} 
    radius={8} 
    strokeOpacity={0}
    // strokeColor={'#FC8415'}
    fillColor='#FC8415'
    fillOpacity={1}
  />
}

function generateCircleShadow(lat, lng, idx) {
  return <Circle key={idx}
    center={{ lat, lng }} 
    radius={75} 
    strokeOpacity={0}
    fillColor='#FC8415'
    fillOpacity={0.5}
  />
}

function generateMarkers(markerCoordinates = []) {
  return markerCoordinates.map(({ lat, lng }, idx) => {
    return [generateCircleCenter(lat, lng, idx * 2 + 1), generateCircleShadow(lat, lng, idx * 2 + 2)]
  }).flat()
}

       {/* <Circle 
          center={{ lat: 37.77, lng: -122.42 }} 
          radius={400} 
          strokeOpacity={0}
          fillColor='#FC8415'
          fillOpacity={0.5}
        /> */}
      {/* <Circle radius={12000} onClick={(e) => handleMarkerClick(e, lat, lng)} center={{ lat, lng }} strokeColor={'transparent'} strokeOpacity={70} fillColor={'FC8415'} /> */}

MapContainer.propTypes = {
    google: PropTypes.any
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_API_KEY ?? '',
})(MapContainer)