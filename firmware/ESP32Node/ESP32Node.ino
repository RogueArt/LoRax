#include <Wire.h>
#include "Adafruit_VEML6070.h"
#include "Adafruit_Si7021.h"
#include "Adafruit_seesaw.h"
#include <TinyGPSPlus.h>
#include <ArduinoWebsockets.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <Adafruit_SSD1306.h>
#include <TinyGPSPlus.h>
#include "secrets.h" //has defines for wifi ssid, password, server info
#define SCREEN_WIDTH 128 // OLED display width,  in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
//AsyncWebServer server(80);

using namespace websockets;
WebsocketsClient client;
float latitude , longitude;
int numSat;
Adafruit_seesaw ss;
Adafruit_VEML6070 uv = Adafruit_VEML6070();
Adafruit_Si7021 sensor = Adafruit_Si7021();
Adafruit_SSD1306 oled(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
TinyGPSPlus gps;
HardwareSerial SerialGPS(1);
int incomingByte = 0;

void registerNode(){
  //only entered when first initiated
  // create JSON message for event
    DynamicJsonDocument data(1024);
    data["type"] = 0;
    data["from"] = "esp";
    char serializedData[200];
    serializeJson(data, serializedData);
    client.send(serializedData);
}

void sendHumidity(float data){
  DynamicJsonDocument telemetry(1024);
  telemetry["type"] = 1;
  telemetry["sensor"] = "humid";
  telemetry["value"] = data;
  char serializedTelemetry[200];
  serializeJson(telemetry, serializedTelemetry);
  client.send(serializedTelemetry);
}

void sendTemp(float data){
  DynamicJsonDocument telemetry(1024);
  telemetry["type"] = 1;
  telemetry["sensor"] = "temp";
  telemetry["value"] = data;
  char serializedTelemetry[200];
  serializeJson(telemetry, serializedTelemetry);
  client.send(serializedTelemetry);
}

void sendUV(int data){
  DynamicJsonDocument telemetry(1024);
  telemetry["type"] = 1;
  telemetry["sensor"] = "uv";
  telemetry["value"] = data;
  char serializedTelemetry[200];
  serializeJson(telemetry, serializedTelemetry);
  client.send(serializedTelemetry);
}

bool connected = false;

void setup()
{
  WiFi.mode(WIFI_MODE_APSTA);

  // //Begin WiFi Soft Access Point
  // WiFi.softAP(ACCESS_POINT_SSID, ACCESS_POINT_PASSWORD);
  WiFi.begin(ssid, password);

  Serial.begin(115200);
    Serial2.begin(115200);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.clearDisplay(); // clear display
  oled.setTextSize(1);          // text size
  oled.setTextColor(WHITE);     // text color
  oled.setCursor(0, 10);        // position to display
  oled.println("Starting GPS"); // text to display
  oled.display();               // show on OLED
  

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
        registerNode();
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

void readSensorData(){
  Serial.print("UV light level: ");
  Serial.println(uv.readUV());
  sendUV(uv.readUV());
  Serial.print("Humidity:    ");
  Serial.print(sensor.readHumidity(), 2);
  sendHumidity(sensor.readHumidity());
  Serial.print("\tTemperature: ");
  Serial.println(sensor.readTemperature(), 2);
  sendTemp(sensor.readTemperature());
  float tempC = ss.getTemp();
  uint16_t capread = ss.touchRead(0);
  Serial.print("Ground Temperature: "); Serial.print(tempC); Serial.println("*C");
  Serial.print("Ground Capacitive: "); Serial.println(capread);
  while(Serial2.available()){ // check for gps data 
    if(gps.encode(Serial2.read()))// encode gps data 
    { 
      if(gps.location.isValid()){
        latitude = gps.location.lat();
        longitude = gps.location.lng();
        numSat = gps.satellites.value();
      }else{
        latitude = 0;
        longitude = 0;
        numSat = 0;
      }
    }
  }
}

void loop()
{
  // let the websockets client check for incoming messages
  if(client.available()) {
     client.poll();
        
    uint64_t now = millis();
    if (now - messageTimestamp > 5000) 
    {
      messageTimestamp = now;
      readSensorData();
      //client.send("hullo");
  
      // Print JSON for debugging
      //Serial.println(output);
    }
  }
 
  delay(1000);
}
