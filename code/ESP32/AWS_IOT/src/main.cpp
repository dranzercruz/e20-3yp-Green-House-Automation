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
#include <HardwareSerial.h>

// --- Control Pins ---
#define DHTPIN 4
#define DHTTYPE DHT22
#define FAN_PIN 22
#define WATER_PIN 5
#define BUTTON_PIN 13
#define MOISTURE_SENSOR_PIN_1 32
#define MOISTURE_SENSOR_PIN_2 33
#define MOISTURE_SENSOR_PIN_3 34
#define MOISTURE_SENSOR_PIN_4 35
#define RE_DE 26     // DE & RE control pin for MAX485
#define RX_PIN 16    // UART2 RX
#define TX_PIN 17    // UART2 TX

HardwareSerial rs485(2);  // Use UART2 (Serial2)
const byte readNPK[] = {0x01, 0x03, 0x00, 0x1E, 0x00, 0x03, 0x65, 0xCD};
byte response[11];

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
int readingNPK[3] = {0, 0, 0}; // N, P, K
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
  rs485.begin(4800, SERIAL_8N1, RX_PIN, TX_PIN);

  pinMode(RE_DE, OUTPUT);
  digitalWrite(RE_DE, LOW);  // Receive mode

  // Set Pin Modes
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(FAN_PIN, OUTPUT);
  pinMode(WATER_PIN, OUTPUT);
  pinMode(MOISTURE_SENSOR_PIN_1, INPUT);
  pinMode(MOISTURE_SENSOR_PIN_2, INPUT);
  pinMode(MOISTURE_SENSOR_PIN_3, INPUT);
  pinMode(MOISTURE_SENSOR_PIN_4, INPUT);

  // Default actuator OFF
  digitalWrite(FAN_PIN, HIGH);
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

  Serial.println("\n---------------------------------------");
  Serial.println("📤 Sending NPK request...");

  digitalWrite(RE_DE, HIGH);   // Enable transmit
  delay(2);
  rs485.write(readNPK, sizeof(readNPK));
  rs485.flush();               // Wait for all data to be sent
  digitalWrite(RE_DE, LOW);    // Enable receive mode

  byte index = 0;
  unsigned long startTime = millis();
  while ((millis() - startTime < 1000) && (index < sizeof(response))) {
    if (rs485.available()) {
      response[index++] = rs485.read();
    }
  }

  Serial.print("📥 Bytes received: ");
  Serial.println(index);

  if (index == 11 && response[0] == 0x01 && response[1] == 0x03 && response[2] == 0x06) {
    readingNPK[0] = (response[3] << 8) | response[4];
    readingNPK[1] = (response[5] << 8) | response[6];
    readingNPK[2] = (response[7] << 8) | response[8];

    Serial.println("✅ NPK Readings Received:");
    Serial.println("┌─────────────────────────────┐");
    Serial.printf ("│ Nitrogen   (N): %4d       │\n", readingNPK[0]);
    Serial.printf ("│ Phosphorus (P): %4d       │\n", readingNPK[1]);
    Serial.printf ("│ Potassium  (K): %4d       │\n", readingNPK[2]);
    Serial.println("└─────────────────────────────┘");

  } else {
    Serial.println("❌ Invalid response or timeout!");
  }

  if(nutrientThreshold[0] > readingNPK[0]) {
    Serial.println("Nitrogen level is below threshold. Activating nutrient N...");
    actuatorState[1] = true;         // Update actuator state
  }else{
    Serial.println("Nitrogen level is within threshold. Deactivating nutrient N...");
    actuatorState[1] = false;        // Update actuator state
  }

  if(nutrientThreshold[1] > readingNPK[1]) {
    Serial.println("Phosphorus level is above threshold. Deactivating nutrient P...");
    actuatorState[2] = false;        // Update actuator state
  }else{
    Serial.println("Phosphorus level is below threshold. Activating nutrient P...");
    actuatorState[2] = true;         // Update actuator state
  }

  if(nutrientThreshold[2] > readingNPK[2]) {
    Serial.println("Potassium level is above threshold. Deactivating nutrient K...");
    actuatorState[3] = false;        // Update actuator state
  }else{
    Serial.println("Potassium level is below threshold. Activating nutrient K...");
    actuatorState[3] = true;         // Update actuator state
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

  if(temperatureThreshold[0] > t) {
    Serial.println("Temperature is below threshold. Activating fan...");
    digitalWrite(FAN_PIN, LOW);  // Activate fan
    actuatorState[0] = true;      // Update actuator state
  } else if(temperatureThreshold[1] < t) {
    Serial.println("Temperature is above threshold. Deactivating fan...");
    digitalWrite(FAN_PIN, HIGH); // Deactivate fan
    actuatorState[0] = false;     // Update actuator state
  }
  
  // Read Moisture Sensors
  int moisture_1 = analogRead(MOISTURE_SENSOR_PIN_1);
  int moisture_2 = analogRead(MOISTURE_SENSOR_PIN_2);
  int moisture_3 = analogRead(MOISTURE_SENSOR_PIN_3);
  int moisture_4 = analogRead(MOISTURE_SENSOR_PIN_4);
  int avgMoisture = (moisture_1 + moisture_2 + moisture_3 + moisture_4) / 4;

  if(moistureThreshold[0] > avgMoisture) {
    Serial.println("Moisture level is below threshold. Activating water pump...");
    digitalWrite(WATER_PIN, LOW);  // Activate water pump
    actuatorState[4] = true;        // Update actuator state
  } else if(moistureThreshold[1] < avgMoisture) {
    Serial.println("Moisture level is above threshold. Deactivating water pump...");
    digitalWrite(WATER_PIN, HIGH); // Deactivate water pump
    actuatorState[4] = false;       // Update actuator state
  }
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
        publishMessage(h, t, avgMoisture, actuatorState, readingNPK);
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
  const int commandPins[] = { FAN_PIN, WATER_PIN };
  if (index >= 0 && index < 2) {
    digitalWrite(commandPins[index], status ? LOW : HIGH);
    actuatorState[index] = status;
    Serial.printf("Command %d executed. State: %s\n", index, status ? "ON" : "OFF");
  }
}