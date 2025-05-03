#include <DHT.h>

#define DHTPIN 15
#define DHTTYPE DHT22
#define WATER_SENSOR_PIN 34

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  delay(2000);
  dht.begin();
  Serial.println("📡 센서 초기화 완료 (JSON 출력)");
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  int waterLevel = analogRead(WATER_SENSOR_PIN);

  if (isnan(h) || isnan(t)) {
    Serial.println("{\"error\": \"DHT22 데이터를 읽지 못했습니다.\"}");
  } else {
    Serial.print("{");
    Serial.print("\"temperature\": ");
    Serial.print(t, 1); // 소수점 1자리까지
    Serial.print(", ");

    Serial.print("\"humidity\": ");
    Serial.print(h, 1);
    Serial.print(", ");

    Serial.print("\"water\": ");
    Serial.print(waterLevel);
    Serial.println("}");
  }

  delay(100);
}
