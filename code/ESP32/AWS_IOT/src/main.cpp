#include <Arduino.h>
#include <register.h>
#include "aws_setup.h"
#include "ArduinoHttpClient.h"
#include "DHT.h"
#include <EEPROM.h>
#include <SPIFFS.h>
#include <WiFi.h>
#include <WebServer.h>
#include "esp_task_wdt.h"

// --- Control Pins ---
#define DHTPIN 4
#define DHTTYPE DHT22
#define FAN_PIN 22
#define NUTRIENT_N 18
#define NUTRIENT_P 19
#define NUTRIENT_K 21
#define WATER_PIN 5
#define BUTTON_PIN 13
#define MOISTURE_SENSOR_PIN_1 32
#define MOISTURE_SENSOR_PIN_2 33
#define MOISTURE_SENSOR_PIN_3 34
#define MOISTURE_SENSOR_PIN_4 35

// --- Globals ---
WebServer server(80);
String ssid = "", password = "", email = "";
long deviceId = -1;
long plantId = -1;
bool registered = false;
bool hasThresholds = false;
const char* AWS_CERT_CRT = nullptr;
const char* AWS_CERT_PRIVATE = nullptr;
const char* THINGNAME = nullptr;
const char* AWS_IOT_ENDPOINT = nullptr;
int commandIndex = -1;
bool status;
bool actuatorState[5] = {false, false, false, false, false};
float h, t;
float moistureThreshold[2];
float temperatureThreshold[2];
float humidityThreshold[2];
float nutrientThreshold[3];
DHT dht(DHTPIN, DHTTYPE);

// --- Function declarations ---
void connectToWifi();
void ensureAWSConnection();
void processCommand(int index, bool status);

// --- Setup ---
void setup() {
  Serial.begin(115200);

  // Set Pin Modes
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(FAN_PIN, OUTPUT);
  pinMode(NUTRIENT_N, OUTPUT);
  pinMode(NUTRIENT_P, OUTPUT);
  pinMode(NUTRIENT_K, OUTPUT);
  pinMode(WATER_PIN, OUTPUT);
  pinMode(MOISTURE_SENSOR_PIN_1, INPUT);
  pinMode(MOISTURE_SENSOR_PIN_2, INPUT);
  pinMode(MOISTURE_SENSOR_PIN_3, INPUT);
  pinMode(MOISTURE_SENSOR_PIN_4, INPUT);

  // Default actuator OFF
  digitalWrite(FAN_PIN, HIGH);
  digitalWrite(NUTRIENT_N, HIGH);
  digitalWrite(NUTRIENT_P, HIGH);
  digitalWrite(NUTRIENT_K, HIGH);
  digitalWrite(WATER_PIN, HIGH);

  dht.begin();

  if (!SPIFFS.begin(true)) {
    Serial.println("SPIFFS Mount Failed");
    return;
  }

  // Handle Reset Button
  delay(100);
  if (digitalRead(BUTTON_PIN) == LOW) {
    Serial.println("Resetting device...");
    EEPROM.begin(1024);
    for (int i = 0; i < 1024; i++) EEPROM.write(i, 0);
    EEPROM.commit();
    EEPROM.end();

    removeFile(SPIFFS, "/cert.pem");
    removeFile(SPIFFS, "/priv.key");
    removeFile(SPIFFS, "/thingName.txt");
    removeFile(SPIFFS, "/endpoint.txt");
  }

  loadCredentials();

  if (registered) {
    connectToWifi();
  } else {
    tryConnectToWiFi();
    Serial.println("Device not registered. Please register first.");
  }
}

// --- Main Loop ---
void loop() {
  server.handleClient();

  // Wi-Fi Recovery
  if (WiFi.status() != WL_CONNECTED && registered) {
    Serial.println("WiFi lost. Attempting reconnect...");
    connectToWifi();
  }

  // Read DHT with retries
  bool success = false;
  for (int i = 0; i < 3; i++) {
    h = dht.readHumidity();
    t = dht.readTemperature();
    if (!isnan(h) && !isnan(t)) {
      success = true;
      break;
    }
    delay(100);
  }
  // if (!success) {
  //   Serial.println("DHT sensor failed. Skipping this cycle.");
  //   return;
  // }
  

  // Read Moisture Sensors
  int moisture_1 = analogRead(MOISTURE_SENSOR_PIN_1);
  int moisture_2 = analogRead(MOISTURE_SENSOR_PIN_2);
  int moisture_3 = analogRead(MOISTURE_SENSOR_PIN_3);
  int moisture_4 = analogRead(MOISTURE_SENSOR_PIN_4);
  int avgMoisture = (moisture_1 + moisture_2 + moisture_3 + moisture_4) / 4;

  // Process commands from cloud
  if (commandIndex >= 0) {
    processCommand(commandIndex, status);
    commandIndex = -1;
  }

  // Publish data to AWS IoT
  if (registered) {
    if (WiFi.status() == WL_CONNECTED) {
      ensureAWSConnection();  // Connect or maintain AWS IoT connection
      if(hasThresholds) {
        Serial.println("Publishing data to AWS IoT...");
        publishMessage(h, t, avgMoisture, actuatorState);
      }
    } else {
      Serial.println("WiFi not connected. Skipping AWS publish.");
    }
  }

  delay(2000);
}

// --- Wi-Fi Connect ---
void connectToWifi() {
  if (WiFi.status() == WL_CONNECTED) return;

  Serial.println("Connecting to WiFi: " + ssid);
  WiFi.begin(ssid.c_str(), password.c_str());

  unsigned long startAttempt = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startAttempt < 15000) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected. IP: " + WiFi.localIP().toString());
    ensureAWSConnection();
  } else {
    Serial.println("WiFi failed to connect.");
  }
}

// --- MQTT (AWS IoT) Reconnection ---
unsigned long lastAWSAttempt = 0;
const unsigned long AWS_RETRY_INTERVAL = 10000; // 10 seconds

void ensureAWSConnection() {
  if (!client.connected()) {
    unsigned long now = millis();
    if (now - lastAWSAttempt >= AWS_RETRY_INTERVAL) {
      Serial.println("MQTT disconnected. Reconnecting to AWS IoT...");
      connectAWS();
      lastAWSAttempt = now;
    }
  }
  client.loop();
}


// --- Command Execution ---
void processCommand(int index, bool status) {
  const int commandPins[] = { FAN_PIN, NUTRIENT_N, NUTRIENT_P, NUTRIENT_K, WATER_PIN };
  if (index >= 0 && index < 5) {
    digitalWrite(commandPins[index], status ? LOW : HIGH);
    actuatorState[index] = status;
    Serial.printf("Command %d executed. State: %s\n", index, status ? "ON" : "OFF");
  }
}
