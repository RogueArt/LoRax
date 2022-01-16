#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <TinyGPSPlus.h>

#define SCREEN_WIDTH 128 // OLED display width,  in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

// declare an SSD1306 display object connected to I2C
Adafruit_SSD1306 oled(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
TinyGPSPlus gps;
float lat = 28.5458,lon = 77.1703;

void setup() {
  //Serial.begin(9600);
  Serial2.begin(9600);

  // initialize OLED display with address 0x3C for 128x64
  if (!oled.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    //Serial.println(F("SSD1306 allocation failed"));
    while (true);
  }

  delay(2000);         // wait for initializing
  oled.clearDisplay(); // clear display

  oled.setTextSize(1);          // text size
  oled.setTextColor(WHITE);     // text color
  oled.setCursor(0, 10);        // position to display
  oled.println("Starting GPS"); // text to display
  oled.display();               // show on OLED
  delay(1000);
}

void loop() {
  while(Serial2.available()){ // check for gps data 
    if(gps.encode(Serial2.read()))// encode gps data 
    {  
      oled.clearDisplay();
      oled.setCursor(0, 10);        // position to display
      if(gps.location.isValid()){
        oled.print("LAT: "); // text to display
        oled.println(gps.location.lat());
        oled.print("LONG: ");
        oled.println(gps.location.lng());
        oled.print("SATS: ");
        oled.println(gps.satellites.value());
      }else{
        oled.println("LAT: N/A");
        oled.println("LONG: N/A");
        oled.println("SATS: N/A");
      }
      oled.display();
      delay(1000); 
    }
  }
  if (millis() > 5000 && gps.charsProcessed() < 10)
  {
    oled.clearDisplay();
    oled.println("No GPS detected");
    oled.display();
    while(true);
  }
}
