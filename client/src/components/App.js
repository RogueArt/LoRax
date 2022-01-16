import React from 'react';
import InfoCard from './InfoCard';
import '../styles/App.scss';
// import ReactFlow from 'react-flow-renderer';

let valueWarnings = {
  "soil": (v) => {
    return (v >= 30 && v <= 70);
  },
  "temp": (v) => {
    return (v >= 50 && v <= 80);
  },
  "humid": (v) => {
    return (v >= 30 && v <= 80);
  },
  "uv": (v) => {
    return (v === "Very Low" || v === "Very High");
  }
}

let sensorToFullName = {
  "soil": "soil",
  "temp": "temperature",
  "humid": "humidity",
  "uv": "UV exposure"
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    }
  }

  componentDidMount () {
    this.connection = new WebSocket("ws://firerisk.herokuapp.com/ws");
    this.connection.onopen = () => {
      let data = JSON.stringify(
        {
          "type": 0, // registering
          "from": "client",
        }
      );
      this.connection.send(data);
    }
    this.connection.onmessage = (msg) => {
      msg = JSON.parse(msg.data);
      if (msg.type === 1) {
        let obj = {};
        obj[msg.sensor] = {
          "value": msg.value,
          "warning": valueWarnings[msg.sensor](msg.value) ? "" : `The ${sensorToFullName[msg.sensor]} is unsafe.`,
        };
        this.setState(obj);
        console.log(this.state);
      }
    }
  }

  render () {
    return (
      <main>
        <div className="info-cards">
          <InfoCard
            title="Soil Moisture"
            value={this.state.soil.value}
            warning={this.state.soil.warning}
          />
          <InfoCard
            title="Temperature"
            value={this.state.temp.value}
            warning={this.state.temp.warning}
          />
          <InfoCard
            title="UV Light"
            value={this.state.uv.value}
            warning={this.state.uv.warning}
            smaller
          />
          <InfoCard
            title="Humidity"
            value={this.state.humid.value}
            warning={this.state.humid.warning}
          />
        </div>
        <div className="map-container"></div>
        <div className="info-text">
          Here’s some more information about plants or fires or whatever we decide to do. Lorem ipsum dolor sit amet, consecteur adipiscing elit. Cras turpis massa, gravida eu nunc ac, pretium luctus tortor. Nulla facilisi. Donec auctor facilisis sapien. 
        </div>
        <div className="disconnect">
          <button>Disconnect</button>
        </div>
      </main>
    );
  }
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