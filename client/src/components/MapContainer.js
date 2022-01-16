import React, { useState } from 'react'
import { GoogleApiWrapper, Marker, InfoWindow, Map } from "google-maps-react";
import PropTypes from 'prop-types'

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

export function MapContainer({ google }) {
  function onMarkerClick() {}
  function onInfoWindowClose() {
    setSelectedPlace({ name: '' })
  }

  const [selectedPlace, setSelectedPlace] = useState({ name: '' })

  return (
      <Map google={google} zoom={14} containerStyle={{ width: '100%', height: '360px'}} style={{}}>
        <Marker onClick={onMarkerClick}
                name={'Current location'} />
 
        <InfoWindow onClose={onInfoWindowClose}>
            <div>
              <h1>{selectedPlace.name}</h1>
            </div>
        </InfoWindow>
      </Map>
    );
}

MapContainer.propTypes = {
    google: PropTypes.any
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_API_KEY ?? '',
})(MapContainer)