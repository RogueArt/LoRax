import React, {useState, useEffect} from "react";
const gateways= [process.env.REACT_APP_HARDWARE_GATEWAY_1, process.env.REACT_APP_HARDWARE_GATEWAY_2];
// const ws_gateways = gateways.map(entry => "ws://" + entry + "/ws" );

export const WebSocketContext = React.createContext({
  state: {},
  connection: undefined
});

//pass in gateway for cloud context with props
export function WebSocketProvider(props){
    const [connection, setConnection] = useState(undefined);
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
      });

      //useEffect for initializing websocket
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
                  warning: getValueWarning({ sensor, value }),
              }, 
            });
            console.log("new state");
            console.log(state);
          }
        }
        
        setConnection(newConnection);
      }, []);

    //websocket functions


    return(
        <WebSocketContext.Provider 
            value = {{
                connection,
                state,
            }}>
            {props.children}
        </WebSocketContext.Provider>
    );
}

const valueWarnings = {
  soil: v => v >= 30 && v <= 70,
  temp: v => v >= 50 && v <= 80,
  humid: v => v >= 30 && v <= 80,
  uv: v => v === "Very Low" || v === "Very High",
}

function getValueWarning({ sensor, value }) {
    const isDangerousValue = valueWarnings[sensor];
  
    if (isDangerousValue(value)) return `The ${sensorToFullName[sensor]} is unsafe.`;
    else ''
  }
  
  const sensorToFullName = {
    soil: "soil",
    temp: "temperature",
    humid: "humidity",
    uv: "UV exposure"
  }
  