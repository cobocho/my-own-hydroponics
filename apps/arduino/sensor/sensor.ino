#include <DHT.h>
#include <Adafruit_NeoPixel.h>
#include <ArduinoJson.h>  // 추가된 라이브러리

#define PIN 5
#define NUM_LEDS 256

#define DHTPIN 15
#define DHTTYPE DHT22
#define WATER_SENSOR_PIN 34

DHT dht(DHTPIN, DHTTYPE);
Adafruit_NeoPixel strip(NUM_LEDS, PIN, NEO_GRB + NEO_KHZ800);

// 현재 색상과 밝기 상태
int currentR = 0, currentG = 0, currentB = 255;
int currentBrightness = 50;

void setup() {
  Serial.begin(115200);
  delay(2000);
  dht.begin();

  strip.begin();
  strip.setBrightness(currentBrightness);
  strip.show();
  updateLEDs();

  Serial.println("💡 WS2812B 초기화 완료");
  Serial.println("📡 센서 초기화 완료");
}

void loop() {
  // 1. 센서 값 읽기
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

  // 2. 시리얼 명령 처리
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
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

  delay(1000); // 센서 주기
}

void updateLEDs() {
  for (int i = 0; i < NUM_LEDS; i++) {
    strip.setPixelColor(i, strip.Color(currentR, currentG, currentB));
  }
  strip.show();
}
