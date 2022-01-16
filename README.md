# About

Firerisk is a mobile and desktop app that allows you to monitor the fire risk of any area by giving you realtime updates on the temperature, humidity, and soil moisture of an area.

Firerisk uses a MongoDB/Express/React/NodeJS (MERN) stack with MongoDB Atlas for database hosting and websockets for hardware communication.

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