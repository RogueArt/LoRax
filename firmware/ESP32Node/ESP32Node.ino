#include <Wire.h>
#include "Adafruit_VEML6070.h"
#include "Adafruit_Si7021.h"
#include "Adafruit_seesaw.h"
#include <TinyGPSPlus.h>
#include <ArduinoWebsockets.h>
#include <AsyncWebSocket.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <Adafruit_SSD1306.h>
#include <TinyGPSPlus.h>
#include <Hash.h>
#include "secrets.h" //has defines for wifi ssid, password, server info

#define SCREEN_WIDTH 128 // OLED display width,  in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
//AsyncWebServer server(80);


AsyncWebServer server(80);

//handle the /ws path on our arduino's webserver as a websocket
AsyncWebSocket ws("/ws");


//websocket event handler
void onEvent(AsyncWebSocket* server, AsyncWebSocketClient* client, AwsEventType type,
  void* arg, uint8_t* data, size_t len){
    Serial.println("Received Message!");
    switch(type){
      case WS_EVT_CONNECT:
        Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
        break;
      case WS_EVT_DISCONNECT:
        Serial.printf("WebSocket client #%u disconnected\n", client->id());
        break;
      case WS_EVT_DATA:
        handleWebSocketMessage(arg, data, len);
        break;
      case WS_EVT_ERROR:
        Serial.println("Something went wrong");
      case WS_EVT_PONG:
        break;
    }    
  }


void handleWebSocketMessage(void* arg, uint8_t *data, size_t len){
  AwsFrameInfo *info = (AwsFrameInfo*)arg;
  //verifying info exists and is text
  if (info->final && info->index ==0 && info->len == len && info->opcode == WS_TEXT){
    Serial.println("Received message!");
  }
}

//websocket initialization and event handler
void initWebSocket(){
  ws.onEvent(onEvent);
  server.addHandler(&ws);
  Serial.println("Socket set-up");
}

void notifyWifiConnection(){
  ws.textAll("Connected!");
  }

String arduinoHash = ACCESS_POINT_SSID;
char ipAddressString[100] = "";

//local wifi globals
char localSSID[100] ="";
char localPassword[200] = "";


void getIpAddress2String(const IPAddress& ipAddress)
{
    strcpy(ipAddressString, "");
    strcat(ipAddressString, String(ipAddress[0]).c_str());
    Serial.print("Data is : ");
    Serial.println(ipAddressString);
    strcat(ipAddressString, ".");
    strcat(ipAddressString, String(ipAddress[1]).c_str());
    strcat(ipAddressString, ".");
    Serial.print("Data is : ");
    Serial.println(ipAddressString);
    strcat(ipAddressString, String(ipAddress[2]).c_str());
    strcat(ipAddressString, ".");
    strcat(ipAddressString, String(ipAddress[3]).c_str());
    Serial.print("Data is : ");
    //store our ipAddress string in side global ipAddress variable, passed around via Wifi_AP
    Serial.println(ipAddressString);
}


using namespace websockets;
WebsocketsClient client;
float latitude = 0;
float longitude = 0;
int numSat = 0;
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
    Serial.print("Arduino Hash is: ");
    Serial.println(arduinoHash);
    data["from"] = "esp";
    data["id"] = arduinoHash;

    char serializedData[200];
    serializeJson(data, serializedData);
    client.send(serializedData);
}

void sendHumidity(float data){
  DynamicJsonDocument telemetry(1024);
  telemetry["type"] = 1;
  telemetry["sensor"] = "humid";
  telemetry["value"] = data;
  telemetry["id"] = arduinoHash;
  char serializedTelemetry[300];
  serializeJson(telemetry, serializedTelemetry);
  client.send(serializedTelemetry);
}

void sendTemp(float data){
  DynamicJsonDocument telemetry(1024);
  telemetry["type"] = 1;
  telemetry["sensor"] = "temp";
  telemetry["value"] = data;
  telemetry["id"] = arduinoHash;
  char serializedTelemetry[300];
  serializeJson(telemetry, serializedTelemetry);
  client.send(serializedTelemetry);
}
void sendSoil(unsigned int data){
  DynamicJsonDocument telemetry(1024);
  telemetry["type"] = 1;
  telemetry["sensor"] = "soil";
  telemetry["value"] = data;
  telemetry["id"] = arduinoHash;
  char serializedTelemetry[300];
  serializeJson(telemetry, serializedTelemetry);
  client.send(serializedTelemetry);
}

void sendUV(int data){
  DynamicJsonDocument telemetry(1024);
  telemetry["type"] = 1;
  telemetry["sensor"] = "uv";
  telemetry["value"] = data;
  telemetry["id"] = arduinoHash;
  char serializedTelemetry[300];
  serializeJson(telemetry, serializedTelemetry);
  client.send(serializedTelemetry);
}

void sendGPS(float longitude, float latitude, int satellites){
  // String gpsString = "";     // empty string
  // gpsString.concat(longitude);
  // gpsString.concat("|");
  // gpsString.concat(latitude);
  // gpsString.concat("|");
  // gpsString.concat(satellites);
  DynamicJsonDocument telemetry(1024);
  DynamicJsonDocument location(1024);
  telemetry["type"] = 3;
  telemetry["numSatellites"] = satellites;
  telemetry["sensor"] = "gps";
  location["lat"] = latitude;
  location["lng"] = longitude;
  telemetry["id"] = arduinoHash;
  char serializedLocation[200];
  serializeJson(location, serializedLocation);

  telemetry["location"] = serializedLocation;


  char serializedTelemetry[200];
  serializeJson(telemetry, serializedTelemetry);
  client.send(serializedTelemetry);
}


bool connected = false;

bool wifiConnected = false;
bool attemptConnect = false;

void setup()
{
  Serial.begin(115200);
  
  WiFi.mode(WIFI_MODE_APSTA);

  //Begin WiFi Soft Access Point
  boolean wifiResult =  WiFi.softAP(ACCESS_POINT_SSID, ACCESS_POINT_PASSWORD);

  //begin ws for wifi connection
  initWebSocket();

  Serial2.begin(115200);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.clearDisplay(); // clear display
  oled.setTextSize(1);          // text size
  oled.setTextColor(WHITE);     // text color
  oled.setCursor(0, 10);        // position to display
  oled.println("Trying to Connect!"); // text to display
  oled.display();               // show on OLED
  
  if(wifiResult){
  Serial.print("Set up Soft Access Point called ");
  Serial.println(ACCESS_POINT_SSID);
  }
  else {
    Serial.println("Failed!");
  }

  IPAddress Ip(192, 168, 1, NODE_IP_NUM);
  IPAddress NMask(255, 255, 255, 0);
  WiFi.softAPConfig(Ip, Ip, NMask);

  //store the ip address in ipAddressString()
  getIpAddress2String(WiFi.softAPIP());

  //Print it out
  Serial.print("IP Address String is: ");
  Serial.println(ipAddressString);

  delay(1000);

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  server.begin();

  server.on("/connect",
  HTTP_POST,
  [](AsyncWebServerRequest *request) {
    
    //temp ssid string
    strcpy(localSSID, "");
    strcpy(localPassword, "");
    // char localSSID[100] ="";
    // char localPassword[100] = "";

    //DynamicJsonDocument requestBody(1024);
    if (request->hasParam("ssid")){
      strcat(localSSID, request->getParam("ssid")->value().c_str());         
    }
    else {
      Serial.println("No SSID!");
      strcat(localSSID, "ERROR");
      //ERROR!
      request->send(401);
      return;
      
    }

    if (request->hasParam("password")){
      strcat(localPassword, request->getParam("password")->value().c_str());
    } else {
      Serial.println("No Password!");
      strcat(localPassword, "ERROR");
      //ERROR!
      request->send(401);
      return;
    }
    Serial.print("SSID is: ");
    Serial.println(localSSID);
    // Serial.print("Password is: ");
    // Serial.println(localPassword);
    Serial.println("SSID and password exist!");
    attemptConnect=true;
    request->send(200);
  }
);

  server.on("/isConnected",
    HTTP_GET,
    [](AsyncWebServerRequest *request) {
      if(WiFi.status() != WL_CONNECTED){
        Serial.println("Not connected to wifi!");
        request->send(400);
        return;
      }
      else {
        Serial.println("Connected to wifi!");

        request->send(200, "text/plain",localSSID);
        return;
      }    
    }
  );

  SerialGPS.begin(115200, SERIAL_8N1, 16, 17);

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
  oled.clearDisplay();
  oled.setCursor(0, 10);  
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
  oled.print("Temp (C): "); 
  oled.println(sensor.readTemperature());
  oled.print(", Humidity: ");
  oled.println(sensor.readHumidity());
  oled.print("Soil Temp: "); 
  oled.println(tempC);
  oled.print("Soil Moisture: "); 
  oled.println(capread);
  oled.print("UV Reading: ");
  oled.println(uv.readUV());
  oled.display();
  while(Serial2.available()){ // check for gps data 
    if(gps.encode(Serial2.read()))// encode gps data 
    { 
      if(gps.location.isValid()){
        latitude = gps.location.lat();
        longitude = gps.location.lng();
        numSat = gps.satellites.value();
      }else{
        //don't update if connection lost
        // latitude = 0;
        // longitude = 0;
        // numSat = 0;
      }
    }
  }
  sendGPS(latitude, longitude, numSat);
}


void loop()
{
  // let the websockets client check for incoming messages
  if(wifiConnected){
    if(client.available()) {
      client.poll();
          
      uint64_t now = millis();
      if (now - messageTimestamp > 30000) 
      {
        messageTimestamp = now;
        readSensorData();
        // Print JSON for debugging
        //Serial.println(output);
      }
    }
  }
  else if (attemptConnect){
    WiFi.begin(localSSID, localPassword);
    // Wait some time to connect to wifi
    for(int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++) {
        Serial.print(".");
        delay(1000);
    }

    wl_status_t connectStatus = WiFi.status();
    if (connectStatus == WL_NO_SSID_AVAIL || connectStatus == WL_CONNECT_FAILED){
      Serial.println("Incorrect wifi credentials!");
      attemptConnect=false;      
      //request->send(401);
    }

    else {
      Serial.println("Connected to Wifi, Connecting to server.");
      wifiConnected = true;
      notifyWifiConnection();
      // try to connect to Websockets server
      bool connected = client.connect(websockets_server_host);
      if(connected) {
          Serial.println("Connected to websocket!");
          registerNode();
      } else {
          Serial.println("Failed Connection!");
      }
      attemptConnect = false;
      // run callback when messages are received
      client.onMessage([&](WebsocketsMessage message){
          Serial.print("Got Message: ");
          Serial.println(message.data());
      });
    }

  } else {
    //Serial.println("Setting up...");
  }

  delay(1000);
}
