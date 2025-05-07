#include <DHT.h>
#include <Adafruit_NeoPixel.h>
#include <ArduinoJson.h>  // 추가 필요

#define PIN 5
#define NUM_LEDS 256

#define DHTPIN 15
#define DHTTYPE DHT22
#define WATER_SENSOR_PIN 34

DHT dht(DHTPIN, DHTTYPE);
Adafruit_NeoPixel strip(NUM_LEDS, PIN, NEO_GRB + NEO_KHZ800);

// 현재 LED 상태 저장
int currentR = 0, currentG = 0, currentB = 255;
int currentBrightness = 50;

void setup() {
  Serial.begin(115200);
  delay(2000);
  dht.begin();

  strip.begin();
  strip.setBrightness(currentBrightness);  // 밝기 적용
  updateLEDs();  // 현재 색상 적용

  Serial.println("💡 WS2812B 초기화 완료");
  Serial.println("📡 센서 초기화 완료");
}

void loop() {
  // 1. 센서 데이터 측정 및 전송
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  int waterLevel = analogRead(WATER_SENSOR_PIN);

  if (isnan(h) || isnan(t)) {
    Serial.println("{\"error\": \"DHT22 데이터를 읽지 못했습니다.\"}");
  } else {
    Serial.print("{");
    Serial.print("\"temperature\": ");
    Serial.print(t, 1);
    Serial.print(", ");

    Serial.print("\"humidity\": ");
    Serial.print(h, 1);
    Serial.print(", ");

    Serial.print("\"water\": ");
    Serial.print(waterLevel);
    Serial.println("}");
  }

  // 2. 시리얼 명령 수신 (JSON 기반)
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');

    Serial.print("📥 받은 명령: ");
    Serial.println(input);

    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, input);

    if (!error) {
      if (doc.containsKey("r")) currentR = doc["r"];
      if (doc.containsKey("g")) currentG = doc["g"];
      if (doc.containsKey("b")) currentB = doc["b"];
      if (doc.containsKey("brightness")) {
        currentBrightness = doc["brightness"];
        strip.setBrightness(currentBrightness);
      }

      updateLEDs();

      Serial.println("{\"status\": \"LED 설정 완료\"}");
    } else {
      Serial.print("{\"error\": \"JSON 파싱 실패: ");
      Serial.print(error.c_str());
      Serial.println("\"}");
    }
  }

  delay(1000);
}

void updateLEDs() {
  Serial.print("💡 LED 업데이트: R=");
  Serial.print(currentR);
  Serial.print(" G=");
  Serial.print(currentG);
  Serial.print(" B=");
  Serial.print(currentB);
  Serial.print(" 밝기=");
  Serial.println(currentBrightness);

  for (int i = 0; i < NUM_LEDS; i++) {
    strip.setPixelColor(i, strip.Color(currentR, currentG, currentB));
  }
  strip.show();
}
