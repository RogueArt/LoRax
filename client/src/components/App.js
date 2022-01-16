import React, { useState, useEffect } from 'react'
import InfoCard from './InfoCard';
import '../styles/App.scss';
import MapContainer from './MapContainer';
// import ReactFlow from 'react-flow-renderer';

const valueWarnings = {
  soil: (v) => {
    return (v >= 30 && v <= 70);
  },
  temp: (v) => {
    return (v >= 50 && v <= 80);
  },
  humid: (v) => {
    return (v >= 30 && v <= 80);
  },
  uv: (v) => {
    return (v === "Very Low" || v === "Very High");
  }
}

const sensorToFullName = {
  soil: "soil",
  temp: "temperature",
  humid: "humidity",
  uv: "UV exposure"
}

function getValueWarning({ sensor, value }) {
  const isDangerousValue = valueWarnings[sensor];

  if (isDangerousValue(value)) return `The ${sensorToFullName[sensor]} is unsafe.`;
  else ''
}

function App() {
  const [state, setState] = useState({
    soil: {
      value: "-",
      warning: "",
    },
    temp: {
      value: "-",
      warning: "",
    },
    humid: {
      value: "-",
      warning: "",
    },
    uv: {
      value: "-",
      warning: "",
    },
  })

  /* eslint-disable */
  const [connection, setConnection] = useState(undefined);
  
  useEffect(() => {
    const newConnection = new WebSocket("ws://firerisk.herokuapp.com/ws");

    newConnection.onopen = () => {
      let data = JSON.stringify(
        {
          "type": 0, // registering
          "from": "client",
        }
      );
      newConnection.send(data);
    }
    
    newConnection.onmessage = (msg) => {
      const { type, sensor, value } = JSON.parse(msg.data);
      if (type === 1) {
        console.log("previous state");
        console.log(state);
        console.log(sensor);
        setState({
          ...state,
          [sensor]: {
              value: value,
              warning: getValueWarning(msg),
          },
        });
        console.log("new state");
        console.log(state);
      }
    }
    
    setConnection(newConnection);
  }, []);

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
      <div className="disconnect">
        <button>Disconnect</button>
      </div>
    </main>
  );
}

export default App;

// const elements = [
//   { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
//   // you can also pass a React component as a label
//   { id: '2', data: { label: <div>Node 2</div> }, position: { x: 100, y: 100 } },
//   { id: 'e1-2', source: '1', target: '2', animated: true },
// ];

// function createNodeConnection(sourceID, targetID) {
//   return {
//     id: `e${sourceID}-${targetID}`,
//     source: sourceID,
//     target: targetID,
//     animated: true,
//   }
// }

// const BasicFlow = () => (
//   <div style={{ width: 1600, height: 1600 }}>
//     <ReactFlow elements={elements} />
//     </div>);

// export default BasicFlow