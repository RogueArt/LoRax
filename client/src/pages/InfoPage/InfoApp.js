import React, { useState, useEffect, useContext } from 'react';
import { WebSocketProvider, WebSocketContext } from '../../contexts/webSocketContext';
import InfoCard from './InfoCard';
import '../../styles/App.scss';
import MapContainer from './MapContainer';

export default function App() {
  const {state} = useContext(WebSocketContext);
  return (
    <main>
      <div className="info-cards">
        <InfoCard
          title="Soil Moisture"
          value={state.soil.value}
          warning={state.soil.warning}
        />
        <InfoCard
          title="Temperature"
          value={state.temp.value}
          warning={state.temp.warning}
        />
        <InfoCard
          title="UV Light"
          value={state.uv.value}
          warning={state.uv.warning}
          smaller
        />
        <InfoCard
          title="Humidity"
          value={state.humid.value}
          warning={state.humid.warning}
        />
      </div>
      <div className="map-container">
        <MapContainer />
      </div>
      <div className="info-text">
        Here’s some more information about plants or fires or whatever we decide to do. Lorem ipsum dolor sit amet, consecteur adipiscing elit. Cras turpis massa, gravida eu nunc ac, pretium luctus tortor. Nulla facilisi. Donec auctor facilisis sapien. 
      </div>
      <div className="btn-container">
        <button>Disconnect</button>
      </div>
    </main>
  );
}
