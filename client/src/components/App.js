import React from 'react';
import InfoCard from './InfoCard';
import '../styles/App.scss';
// import ReactFlow from 'react-flow-renderer';

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
    this.connection = new WebSocket("ws://localhost:8081");
    this.connection.onopen = () => {
      this.connection.send(JSON.stringify(
        {
          "type": 0, // registering
          "from": "client",
        }
      ));
    }
    this.connection.onmessage = (msg) => {
      msg = JSON.parse(msg);
      if (msg.type === 1) {
        let obj = {};
        obj[msg.sensor] = msg.value;
        this.setState(obj);
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