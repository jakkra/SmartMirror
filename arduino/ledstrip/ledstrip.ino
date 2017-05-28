#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#include <MsTimer2.h>

#define PIN 6
#define NUM_LEDS 77
#define NUM_LEDS_HORIZONTAL 16
#define NUM_LEDS_VERTICAL 22

void reUpdateColors();

// Parameter 1 = number of pixels in strip
// Parameter 2 = Arduino pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
//   NEO_RGBW    Pixels are wired for RGBW bitstream (NeoPixel RGBW products)
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_GRB + NEO_KHZ800);
int brightness = 50;
uint32_t topColor = strip.Color(200, 100, 100);
uint32_t rightColor = strip.Color(200, 100, 100);
uint32_t bottomColor = strip.Color(200, 100, 100);
uint32_t leftColor = strip.Color(200, 100, 100);


void setup() {
  Serial.begin(9600);
  MsTimer2::set(1000L * 60 * 20, reUpdateColors); // 20 min period
  MsTimer2::start(); // Sometimes the mirror spontainiously changes some leds color :/ , quick fix for that.
  strip.begin();
  strip.setBrightness(brightness);
  strip.show();
  colorWipe();
}

void loop() {
  // cmd = cmd:params\n
  // rgb:r:g:b\n
  // mode:rainbow\n
  // brightness:value\n
  // brightnessUp:\n
  // brightnessDown:\n
  // side:top/right/bottom/left:r:g:b\n
  if(Serial.available()){
    String cmd = Serial.readStringUntil(':');
    if(cmd.equals("brightness")){
      int brightness = Serial.readStringUntil('\n').toInt();
      setBrightness(brightness);
    } else if(cmd.equals("rgb")){
      setColor(parseRGB());
    } else if(cmd.equals("mode")){
      String mode = Serial.readStringUntil(':');
      int speed = Serial.readStringUntil('\n').toInt();
      setMode(mode, speed);
    } else if(cmd.equals("side")){
      String side = Serial.readStringUntil(':');
      setSideColor(side, parseRGB());
    } else if(cmd.equals("brightnessUp")){
      setBrightness(brightness + 25); 
    } else if(cmd.equals("brightnessDown")){
      setBrightness(brightness - 25);
    }
  }
}

void reUpdateColors() {
  colorWipe();
}

void setSideColor(String side, uint32_t c){
  if(side == "top"){
    topColor = c;
  } else if(side == "right"){
    rightColor = c;
  } else if(side == "bottom"){
    bottomColor = c;
  } else if(side == "left"){
    leftColor = c;
  }
  colorWipe();
}


uint32_t parseRGB(){
  int r = Serial.readStringUntil(':').toInt();
  int g = Serial.readStringUntil(':').toInt();
  int b = Serial.readStringUntil(':').toInt();
  return strip.Color(r, g, b);
}

void setBrightness(int b){
  int bri = b;
  if(bri > 255){
    bri = 255;
  } else if(bri < 1){
    bri = 10;
  }
  brightness = bri;
  strip.setBrightness(bri);
  strip.show();
}



void setColor(uint32_t c){
  topColor = c;
  rightColor = c;
  bottomColor = c;
  leftColor = c;
  colorWipe();
}

void setMode(String mode, int speed){
  if(mode.equals("rainbow")){
    rainbow(speed);    
  } else if(mode.equals("rainbowCycle")){
    rainbowCycle(speed);
  } else if(mode.equals("theaterChaseRainbow")){
    theaterChaseRainbow(speed);
  } else if(mode.equals("middleFill")) {
    middleFill(speed);
  }
}

void setPixelColor( uint16_t n, uint32_t c) {
   strip.setPixelColor(n, c);
}

void colorWipe() {
  uint32_t c;
  for(uint16_t i=0; i<strip.numPixels(); i++) {
    if(i >= 0 && i < NUM_LEDS_HORIZONTAL){
      c = bottomColor;
    } else if(i >= NUM_LEDS_HORIZONTAL && i < NUM_LEDS_HORIZONTAL + NUM_LEDS_VERTICAL){
      c = rightColor;
    } else if(i >= NUM_LEDS_HORIZONTAL + NUM_LEDS_VERTICAL && i < 2 * NUM_LEDS_HORIZONTAL + NUM_LEDS_VERTICAL){
      c = topColor;
    } else {
      c = leftColor;
    }
    setPixelColor(i, c);
    strip.show();
    delay(5);
  }
}

void colorWipe(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
    setPixelColor(i, c);
    strip.show();
    delay(wait);
  }
}


void middleFill(uint8_t wait) {
  clearStrip();

  for(j=0; !Serial.available(); j++) {
    uint32 c = Wheel((j + 10) % 255)

    for(uint16_t i=0; i<(strip.numPixels()/2) && !Serial.available(); i++) { // start from the middle, lighting an LED on each side
      strip.setPixelColor(strip.numPixels()/2 + i, c);
      strip.setPixelColor(strip.numPixels()/2 - i, c);
      strip.show();
      delay(wait);
    }

    for(uint16_t i=0; i<(strip.numPixels()/2) && !Serial.available(); i++) { // reverse
      strip.setPixelColor(i, strip.Color(0, 0, 0));
      strip.setPixelColor(strip.numPixels() - i, strip.Color(0, 0, 0));
      strip.show();
      delay(wait);
    }
  }
}


void rainbow(uint8_t wait) {
  uint16_t i, j;

  for(j=0; !Serial.available(); j++) {
    for(i=0; i<strip.numPixels(); i++) {
      setPixelColor(i, Wheel((i+j%255) & 255));
      if(Serial.available()) return;
    }
    strip.show();
    delay(wait);
  }
}

void rainbowCycle(uint8_t wait) {
  uint16_t i, j;

  for(j=0; !Serial.available(); j++) { // 5 cycles of all colors on wheel
    for(i=0; i< strip.numPixels(); i++) {
      setPixelColor(i, Wheel(((i * 256 / strip.numPixels()) + (j % 255*5)) & 255));
    }
    strip.show();
    delay(wait);
  }
}

void theaterChase(uint32_t c, uint8_t wait) {
  for (int j=0; j<10; j++) {  //do 10 cycles of chasing
    for (int q=0; q < 3; q++) {
      for (uint16_t i=0; i < strip.numPixels(); i=i+3) {
        setPixelColor(i+q, c);    //turn every third pixel on
      }
      if(Serial.available()) return;
      strip.show();

      delay(wait);

      for (uint16_t i=0; i < strip.numPixels(); i=i+3) {
        setPixelColor(i+q, 0);        //turn every third pixel off
      }
    }
  }
}

void theaterChaseRainbow(uint8_t wait) {
  for (int j=0; j < 256; j++) {     // cycle all 256 colors in the wheel
    for (int q=0; q < 3; q++) {
      for (uint16_t i=0; i < strip.numPixels(); i=i+3) {
        setPixelColor(i+q, Wheel( (i+j) % 255));    //turn every third pixel on
      }
      strip.show();
      if(Serial.available()) return;
      delay(wait);

      for (uint16_t i=0; i < strip.numPixels(); i=i+3) {
        setPixelColor(i+q, 0);        //turn every third pixel off
      }
    }
  }
}

uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return strip.Color((255 - WheelPos * 3), 0, (WheelPos * 3));
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return strip.Color(0, (WheelPos * 3), (255 - WheelPos * 3));
  }
  WheelPos -= 170;
  return strip.Color((WheelPos * 3), (255 - WheelPos * 3), 0);
}
