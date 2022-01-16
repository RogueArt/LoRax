// import React, {useState} from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import Header from '../../components/Header';
import '../../styles/ConnectANode.scss';

const instructions = [
  '1. Open your Wi-Fi settings and connect to following network:',
  '2. Type the details of your own Wi-Fi network in the boxes below.',
  '3. Once the status above changes to “Connected,” you’re all set! Switch back to your own network and enjoy the LoRax system.'
]

function ConnectANode() {
    return (
      <>
        <Header title={'Connect to a Node'} />
        <main className={'instructions-list'}>
            <h1 className={'instruction__header'}>Instructions:</h1>
            <InstructionText instruction={instructions[0]} />
            <div className={'instruction-code-container'}>
              <code>
                SSID:     FireNode
                <br />
                Password: Alarm1234
              </code>
            </div>
            <InstructionText instruction={instructions[1]} />
            <input type="text" />
            <input type="text" />
            <InstructionText instruction={instructions[2]} />
        </main>
      </>

    );
}

function InstructionText({ instruction }) {
  return <div className={'instruction'}>{instruction}</div>
}

InstructionText.propTypes = {
  instruction: PropTypes.string,
}

export default ConnectANode;