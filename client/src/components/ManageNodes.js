import React, {useState} from 'react';

const ESP_SOFT_AP = "http://192.168.4.1";

function ManageNodes() {
    const [ssid, setSsid] = useState("");
    const [password, setPassword] = useState("");
    
    return (
        <main>
            <label>Wi-Fi SSID</label>
            <input type="text" onChange={(event) => setSsid(event.target.value)}/>
            <label>Wi-Fi Password</label>
            <input type="password" onChange={(event) => setPassword(event.target.value)}/>
            <button onClick={ () => attemptWifiPass(ssid, password)}>Submit</button>
            <button onClick={ () => checkConnection()}>Connected?</button>
        </main>
    );
}

async function checkConnection(){
    const isConnected = await fetch (ESP_SOFT_AP +"/isConnected");
    if(isConnected.status !== 200){
        alert("Not connected!")
    }
    else {
        alert("Node connected to WiFi!");
    }
}

async function attemptWifiPass(ssid, password){
    const isConnected = await fetch (ESP_SOFT_AP +"/isConnected");
    const wifiStatus = isConnected.status;
    if(wifiStatus === 200){
       console.log("Already connected to wifi!");
    }
    else {
        //const attemptWifi = 
        await fetch(
            ESP_SOFT_AP +
              "/connect?ssid=" +
              ssid +
              "&password=" +
              password,
            {
              method: "POST",
            }
          );
    }
}

export default ManageNodes;