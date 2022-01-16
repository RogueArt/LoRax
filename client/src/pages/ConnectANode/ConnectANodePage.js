// import React, {useState} from 'react';
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Header from '../../components/Header';
import '../../styles/ConnectANode.scss';
const ips = ["192.168.1.5", "192.168.1.6"];
const instructions = [
  '1. Open your Wi-Fi settings and connect to following network:',
  '2. Type the details of your own Wi-Fi network in the boxes below.',
  '3. Once the status above changes to “Connected,” you’re all set! Switch back to your own network and enjoy the LoRax system.'
]



function ConnectANode() {
    const [connection, setConnection] = useState(undefined);
    const [chosen, setChosen] = useState(0);
    const [ssidInput, setSSidInput] = useState("");
    const [ssidPassInput, setSsidPassInput] = useState("");

    useEffect(() => {
      const newConnection = new WebSocket("ws://" + ips[chosen] +"/ws");
  
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
        if(msg.data === "Connected!"){
          alert("Connected to wifi successfully, you may disconnect!");
        }
      }
      setConnection(newConnection);
      return
        () => newConnection.close();
      
    },
     [chosen]);

     async function sendCredentials(ssid, pass){
      const connectURL = `http://${ips[chosen]}/connect?ssid=${ssid}&password=${pass}`;
      await fetch(connectURL, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
    }

    
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
            <input type="text" placeholder='WiFi SSID' value={ssidInput} onChange={(e) => setSSidInput(e.target.value)} />
            <input type="password" placeholder='WiFi Password' value ={ssidPassInput} onChange={(e) => setSsidPassInput(e.target.value)} />
            <InstructionText instruction={instructions[2]} />
        <button onClick={() => setChosen(0)} style={ chosen == 0 ? {
          backgroundColor: "orange"
        } : {}} >TreeNode</button>
        <button onClick={() => setChosen(1)} style={ chosen == 1 ? {
          backgroundColor: "orange"
        } : {}}>FireNode</button>
        <button onClick={() => sendCredentials(ssidInput, ssidPassInput)}>Connect!</button>

            
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
