#include <Wire.h>
#include "Adafruit_VEML6070.h"
#include "Adafruit_Si7021.h"
#include "Adafruit_seesaw.h"
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <ArduinoWebsockets.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include "secrets.h" //has defines for wifi ssid, password, server info
using namespace websockets;
WebsocketsClient client;
float latitude , longitude;
String  lat_str , lng_str;
Adafruit_seesaw ss;
Adafruit_VEML6070 uv = Adafruit_VEML6070();
Adafruit_Si7021 sensor = Adafruit_Si7021();
TinyGPSPlus gps;
HardwareSerial SerialGPS(1);
int incomingByte = 0;
void setup()
{
  
  Serial.begin(115200);
  SerialGPS.begin(115200, SERIAL_8N1, 16, 17);
  WiFi.begin(ssid, password);

    // Wait some time to connect to wifi
    for(int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++) {
        Serial.print(".");
        delay(1000);
    }

    // Check if connected to wifi
    if(WiFi.status() != WL_CONNECTED) {
        Serial.println("No Wifi!");
        return;
    }

    Serial.println("Connected to Wifi, Connecting to server.");
    // try to connect to Websockets server
    bool connected = client.connect(websockets_server_host);
    if(connected) {
        Serial.println("Connected!");
        client.send("Hello Server");
    } else {
        Serial.println("Not Connected!");
    }
    
    // run callback when messages are received
    client.onMessage([&](WebsocketsMessage message){
        Serial.print("Got Message: ");
        Serial.println(message.data());
    });
  uv.begin(VEML6070_1_T); // pass in the integration time constant
  if (!ss.begin(0x36)) {
    Serial.println("ERROR! seesaw not found");
    while(1) delay(1);
  } else {
    Serial.print("seesaw started! version: ");
    Serial.println(ss.getVersion(), HEX);
  }
}

unsigned long messageTimestamp = 0;

void loop()
{
  // let the websockets client check for incoming messages
  if(client.available()) {
     client.poll();
        
    uint64_t now = millis();
    if (now - messageTimestamp > 5000) 
    {
      messageTimestamp = now;
  
      client.send("hullo");
  
      // Print JSON for debugging
      //Serial.println(output);
    }
  }
  Serial.print("UV light level: ");
  Serial.println(uv.readUV());
  Serial.print("Humidity:    ");
  Serial.print(sensor.readHumidity(), 2);
  Serial.print("\tTemperature: ");
  Serial.println(sensor.readTemperature(), 2);
  float tempC = ss.getTemp();
  uint16_t capread = ss.touchRead(0);

  Serial.print("Ground Temperature: "); Serial.print(tempC); Serial.println("*C");
  Serial.print("Ground Capacitive: "); Serial.println(capread);

  if (SerialGPS.available() > 0) {
    // read the incoming byte:
    incomingByte = SerialGPS.read();

    // say what you got:
    Serial.print("I received: ");
    Serial.println(incomingByte, DEC);
  } 

  delay(1000);
}
