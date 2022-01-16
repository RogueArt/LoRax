#include <ArduinoJson.h>
#include <WebSocketsClient_Generic.h>
#include <SocketIOclient_Generic.h>
#include "secrets.h"
#include <WiFi.h>

SocketIOclient socketIO;

int status = WL_IDLE_STATUS;


void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) 
{
  switch (type) 
  {
    case sIOtype_DISCONNECT:
      Serial.println("[IOc] Disconnected");
      break;
    case sIOtype_CONNECT:
      Serial.print("[IOc] Connected to url: ");
      Serial.println((char*) payload);

      // join default namespace (no auto join in Socket.IO V3)
      socketIO.send(sIOtype_CONNECT, "/");
      
      break;
    case sIOtype_EVENT:
      Serial.print("[IOc] Get event: ");
      Serial.println((char*) payload);
      
      break;
    case sIOtype_ACK:
      Serial.print("[IOc] Get ack: ");
      Serial.println(length);
      
      //hexdump(payload, length);
      break;
    case sIOtype_ERROR:
      Serial.print("[IOc] Get error: ");
      Serial.println(length);
      
      //hexdump(payload, length);
      break;
    case sIOtype_BINARY_EVENT:
      Serial.print("[IOc] Get binary: ");
      Serial.println(length);
      
      //hexdump(payload, length);
      break;
    case sIOtype_BINARY_ACK:
       Serial.print("[IOc] Get binary ack: ");
      Serial.println(length);
      
      //hexdump(payload, length);
      break;
      
    default:
      break;  
  }
}


void setup() {
  // put your setup code here, to run once:
  //Initialize serial and wait for port to open:
  Serial.begin(115200);
  while (!Serial);

  Serial.print("\nStart WebSocketClientSocketIO_WiFi on \n");
  Serial.println(WEBSOCKETS_GENERIC_VERSION);

  // check for the WiFi module:
  // if (WiFi.status() == WL_NO_MODULE)
  // {
  //   Serial.println("Communication with WiFi module failed!");
  //   // don't continue
  //   while (true);
  // }

  Serial.print(F("Connecting to SSID: "));
  Serial.println(WIFI);

  status = WiFi.begin(WIFI, WIFI_PASS);

  delay(1000);
   
  // attempt to connect to WiFi network
  while ( status != WL_CONNECTED)
  {
    delay(500);
        
    // Connect to WPA/WPA2 network
    status = WiFi.status();
  }


  // server address, port and URL
  Serial.print("Connecting to WebSockets Server @ IP address: ");
  Serial.print(BASE_URL);
  Serial.print(", port: ");
  Serial.println(80);

  // setReconnectInterval to 10s, new from v2.5.1 to avoid flooding server. Default is 0.5s
  socketIO.setReconnectInterval(10000);

  socketIO.setExtraHeaders("Authorization: 1234567890");

  //socketIO.setExtraHeaders("Authorization: 1234567890");

  // server address, port and URL
  // void begin(IPAddress host, uint16_t port, String url = "/socket.io/?EIO=4", String protocol = "arduino");
  // To use default EIO=4 from v2.5.1
  socketIO.begin(BASE_URL, 80);

  // event handler
  socketIO.onEvent(socketIOEvent);
}


unsigned long messageTimestamp = 0;
void loop() 
{
  socketIO.loop();

  uint64_t now = millis();

  if (now - messageTimestamp > 30000) 
  {
    messageTimestamp = now;

    // creat JSON message for Socket.IO (event)
    DynamicJsonDocument array(1024);
    
    

    // add evnet name
    // Hint: socket.on('event_name', ....
    array.add("soil");

    // add payload (parameters) for the event
    JsonObject param1 = array.createNestedObject();
    param1["now"]     = (uint32_t) now;

    // JSON to String (serializion)
    String output;
    serializeJson(doc, output);

    // Send event
    socketIO.sendEVENT(output);

    // Print JSON for debugging
    Serial.println(output);
  }
}
