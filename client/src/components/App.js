import React from 'react';
import InfoCard from './InfoCard';
import '../styles/App.scss';
// import ReactFlow from 'react-flow-renderer';

class App extends React.Component {
  render () {
    return (
      <main>
        <div className="info-cards">
          <InfoCard
            title="Soil Moisture"
            value="100%"
            warning="This soil is highly unsafe."
          />
          <InfoCard
            title="Temperature"
            value="67°F"
          />
          <InfoCard
            title="UV Light"
            value="Normal"
            smaller
          />
          <InfoCard
            title="Humidity"
            value="53%"
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