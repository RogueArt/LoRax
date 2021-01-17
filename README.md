# About LoRax

LoRax is an award-winning wildfire risk monitor. Specifically, LoRax is an IoT distributed system of nodes reporting information that is centralized via the cloud. The name comes from **Lo**ng **Ra**nge e**x**amination, from its ability to report soil moisture, temperature, UV light, humidity data, and GPS coordinates from nearly 300 meters away.

<!-- Pictures of mobile app -->
<h3 align="center">Mobile App</h1>
<p align="center">
   <img src="https://user-images.githubusercontent.com/57082175/149679651-0003f97c-132f-448e-9eea-8363890621d1.png" alt="Landing Page" width="360px" height="800px" />
   <img src="https://user-images.githubusercontent.com/57082175/149679644-77b8c928-5bbf-46b5-8545-b4cf0e2e5491.png" alt="Manage Nodes" width="360px" height="800px" />
</p>

<!-- Pictures of rock and tree node -->
<h3 align="center">Hardware (Rock and Tree Node)</h1>
<h4 align="center">Rock Node</h4>
<p align="center">
   <img src="https://user-images.githubusercontent.com/57082175/149680518-dc15a6e8-546b-4861-b017-f184173c6047.jpg" alt="Landing Page" />
</p>
<h4 align="center">Tree Node</h4>
<p align="center">
   <img align="center" src="https://user-images.githubusercontent.com/57082175/149680521-7bd9342b-39eb-413e-9604-17ffdeb3caaf.gif" alt="Manage Nodes"  />
</p>


### Software:
The progressive web app is built using a MongoDB/Express/React/NodeJS (MERN) stack using Heroku as our cloud server and MongoDB Atlas to store and persist data. 

### Hardware:
Each LoRax node uses an ESP 32, using the Arduino IDE to load and flash the firmware onto the board.
Each node contains:
- UV sensor
- Temperature & humidity sensor
- Soil temperature & moisture sensor
- OLED display
- Neo-6M GPS
- 4 AA batteries (for power)

Each node communicates to our Heroku-hosted backend where data is 

# Getting Started

## Prerequisites

Install the following to get started:
- [NodeJS v16 or higher](https://nodejs.org/en/download/)
- [Arduino IDE](https://www.arduino.cc/en/software)

The following hardware is required to build the device:

## Installation

1. Clone this repo from here:
```bash
git clone https://github.com/RogueArt/firerisk
```

2. Install required dependencies:
```bash
cd firerisk # Go into the project folder
npm run build # Install dependencies
```

## Hardware Setup

1. Ensure that the ESP32 board configuration has installed.

2. Install the following libraries in the Arduino IDE Library Manager:
- [Adafruit VEML6070](https://github.com/adafruit/Adafruit_VEML6070)
- [Adafruit Si7021](https://github.com/adafruit/Adafruit_Si7021)
- Adafruit Seesaw
- Arduino Websockets
- [ArduinoJson](https://arduinojson.org/)
- [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer)
- [TinyGPSPlus](https://github.com/mikalhart/TinyGPSPlus)

3. Update `secrets.h` for your WiFi SSID and server details.

4. Compile and upload `firmware/ESP32Node/ESP32Node.ino`.

## Running

To run the client or server, simply run the following command from their respective folders:
```bash
npm run start
```