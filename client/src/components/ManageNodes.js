// import React, {useState} from 'react';
import React from 'react';
import NodeCard from "./NodeCard.js";

// const ESP_SOFT_AP = "http://192.168.4.1";

function ManageNodes() {
    // const [ssid, setSsid] = useState("");
    // const [password, setPassword] = useState("");
    
    return (
        <main className={'node-card-list'}>
            <NodeCard
                name="Backyard Kipling"
                signal="Good"
                issues={1}
            />
            <NodeCard
                name="Margaret Atwood"
                signal="Poor"
                issues={0}
            />
            <NodeCard
                name="Margaret Atwood"
                signal="Disconnected"
                issues={0}
            />
            <div className="btn-container">
                <button>Edit Nodes</button>
            </div>
            <div className="btn-container">
                <button>Connect Wi-Fi</button>
            </div>
        </main>
    );
}

/* <label>Wi-Fi SSID</label>
<input type="text" onChange={(event) => setSsid(event.target.value)}/>
<label>Wi-Fi Password</label>
<input type="password" onChange={(event) => setPassword(event.target.value)}/>
<button onClick={ () => attemptWifiPass(ssid, password)}>Submit</button>
<button onClick={ () => checkConnection()}>Connected?</button> */

// async function checkConnection(){
//     const isConnected = await fetch (ESP_SOFT_AP +"/isConnected");
//     if(isConnected.status !== 200){
//         alert("Not connected!")
//     }
//     else {
//         alert("Node connected to WiFi!");
//     }
// }

// async function attemptWifiPass(ssid, password){
//     const isConnected = await fetch (ESP_SOFT_AP +"/isConnected");
//     const wifiStatus = isConnected.status;
//     if(wifiStatus === 200){
//        console.log("Already connected to wifi!");
//     }
//     else {
//         //const attemptWifi = 
//         await fetch(
//             ESP_SOFT_AP +
//               "/connect?ssid=" +
//               ssid +
//               "&password=" +
//               password,
//             {
//               method: "POST",
//             }
//           );
//     }
// }

export default ManageNodes;