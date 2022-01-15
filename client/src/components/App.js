import React from 'react';
import ReactFlow from 'react-flow-renderer';

const elements = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  // you can also pass a React component as a label
  { id: '2', data: { label: <div>Node 2</div> }, position: { x: 100, y: 100 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

function createNodeConnection(sourceID, targetID) {
  return {
    id: `e${sourceID}-${targetID}`,
    source: sourceID,
    target: targetID,
    animated: true,
  }
}

const BasicFlow = () => (
  <div style={{ width: 1600, height: 1600 }}>
    <ReactFlow elements={elements} />
    </div>);

export default BasicFlow