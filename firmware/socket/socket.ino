#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

#include "secrets.h"
#include <WebSocketsClient.h>
#include <SocketIOclient.h>

WiFiMulti WiFiMulti;
SocketIOclient socketIO;

#define USE_SERIAL Serial

//yoinked from https://github.com/Links2004/arduinoWebSockets/blob/master/examples/esp32/WebSocketClientSocketIOack/WebSocketClientSocketIOack.ino


void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case sIOtype_DISCONNECT:
            USE_SERIAL.printf("[IOc] Disconnected!\n");
            break;
        case sIOtype_CONNECT:
            USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);

            // join default namespace (no auto join in Socket.IO V3)
            socketIO.send(sIOtype_CONNECT, "/");
            break;
        case sIOtype_EVENT:
        {
            char * sptr = NULL;
            int id = strtol((char *)payload, &sptr, 10);
            USE_SERIAL.printf("[IOc] get event: %s id: %d\n", payload, id);
            if(id) {
                payload = (uint8_t *)sptr;
            }
            DynamicJsonDocument doc(1024);
            DeserializationError error = deserializeJson(doc, payload, length);
            if(error) {
                USE_SERIAL.print(F("deserializeJson() failed: "));
                USE_SERIAL.println(error.c_str());
                return;
            }

            String eventName = doc[0];
            USE_SERIAL.printf("[IOc] event name: %s\n", eventName.c_str());

            // Message Includes a ID for a ACK (callback)
            if(id) {
                // creat JSON message for Socket.IO (ack)
                DynamicJsonDocument docOut(1024);
                JsonArray array = docOut.to<JsonArray>();

                // add payload (parameters) for the ack (callback function)
                JsonObject param1 = array.createNestedObject();
                param1["now"] = millis();

                // JSON to String (serializion)
                String output;
                output += id;
                serializeJson(docOut, output);

                // Send event
                socketIO.send(sIOtype_ACK, output);
            }
        }
            break;
        case sIOtype_ACK:
            USE_SERIAL.printf("[IOc] get ack: %u\n", length);
            break;
        case sIOtype_ERROR:
            USE_SERIAL.printf("[IOc] get error: %u\n", length);
            break;
        case sIOtype_BINARY_EVENT:
            USE_SERIAL.printf("[IOc] get binary: %u\n", length);
            break;
        case sIOtype_BINARY_ACK:
            USE_SERIAL.printf("[IOc] get binary ack: %u\n", length);
            break;
    }
}



void setup() {
    //USE_SERIAL.begin(921600);
    USE_SERIAL.begin(115200);
    USE_SERIAL.setDebugOutput(true);

    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

      for(uint8_t t = 4; t > 0; t--) {
          USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
          USE_SERIAL.flush();
          delay(1000);
      }

    WiFiMulti.addAP(WIFI, WIFI_PASS);

    //WiFi.disconnect();
    while(WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
    }

    String ip = WiFi.localIP().toString();
    USE_SERIAL.printf("[SETUP] WiFi Connected %s\n", ip.c_str());

    // server address, port and URL
    socketIO.begin(BASE_URL, 8080, "/");

    // event handler
    socketIO.onEvent(socketIOEvent);
}

unsigned long messageTimestamp = 0;
void loop() {
    socketIO.loop();

    uint64_t now = millis();

    if(now - messageTimestamp > 2000) {
        messageTimestamp = now;

        // creat JSON message for Socket.IO (event)
        DynamicJsonDocument doc(1024);
        JsonArray array = doc.to<JsonArray>();

        // add evnet name
        // Hint: socket.on('event_name', ....
        array.add("soil");

        // add payload (parameters) for the event
        JsonObject param1 = array.createNestedObject();
        param1["now"] = (uint32_t) now;

        // JSON to String (serializion)
        String output;
        serializeJson(doc, output);

        // Send event
        socketIO.sendEVENT(output);

        // Print JSON for debugging
        USE_SERIAL.println(output);
    }
}
