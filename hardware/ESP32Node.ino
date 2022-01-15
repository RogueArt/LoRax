
#include <Wire.h>
#include "Adafruit_VEML6070.h"
#include "Adafruit_Si7021.h"
#include "Adafruit_seesaw.h"
#include <TinyGPS++.h>
#include <HardwareSerial.h>

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
  
Serial.begin(9600);
SerialGPS.begin(9600, SERIAL_8N1, 16, 17);
Serial.println("VEML6070 Test");
uv.begin(VEML6070_1_T); // pass in the integration time constant
  if (!ss.begin(0x36)) {
    Serial.println("ERROR! seesaw not found");
    while(1) delay(1);
  } else {
    Serial.print("seesaw started! version: ");
    Serial.println(ss.getVersion(), HEX);
  }
}
 
void loop()
{
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
  } else {Serial.println("Just rage quit");}


delay(1000);
}
