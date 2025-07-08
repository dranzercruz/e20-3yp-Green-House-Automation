#pragma once
#include <WiFi.h>
#include <WebServer.h>
#include <EEPROM.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WiFiClient.h>
#include "SPIFFS.h"

extern WebServer server;
extern String ssid;
extern String password;
extern String email;
extern long deviceId;
extern long plantId;
extern bool registered;
extern float moistureThreshold[2];
extern float temperatureThreshold[2];
extern float humidityThreshold[2];
extern float nutrientThreshold[3];
extern bool hasThresholds;

extern const char* AWS_CERT_CRT;
extern const char* AWS_CERT_PRIVATE;
extern const char* THINGNAME;
extern const char* AWS_IOT_ENDPOINT;

// Helper strings to maintain memory
String certString;
String privateKeyString;
String thingNameString;
String endpointString;

void writeFile(fs::FS &fs, const char * path, const char * message) {
  File file = fs.open(path, FILE_WRITE);
  if (!file) {
    Serial.println("Failed to open file for writing: " + String(path));
    return;
  }
  file.print(message);
  file.close();
}

void removeFile(fs::FS &fs, const char * path) {
  if (fs.exists(path)) {
    if (fs.remove(path)) {
      Serial.println("File removed: " + String(path));
    } else {
      Serial.println("Failed to remove file: " + String(path));
    }
  } else {
    Serial.println("File does not exist: " + String(path));
  }
}

String readFileAsString(fs::FS &fs, const char * path) {
  File file = fs.open(path);
  if (!file || file.isDirectory()) {
    Serial.println("Failed to open file for reading: " + String(path));
    return "";
  }

  String content = file.readString();
  file.close();
  return content;
}

void saveCredentials() {
  EEPROM.begin(1024);
  EEPROM.writeString(0, ssid);
  EEPROM.writeString(100, password);
  EEPROM.writeString(200, email);
  EEPROM.write(290, registered);
  EEPROM.write(300, deviceId);
  EEPROM.commit();
  EEPROM.end();
}

const char* RegisterForm = R"rawliteral(
  <!DOCTYPE html>
  <html>
  <head>
    <title>Green Tech Registration</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f0f2f5;
        padding: 20px;
        text-align: center;
      }
      h2 {
        color: #333;
      }
      form {
        background: #fff;
        padding: 25px;
        margin: auto;
        width: 90%;
        max-width: 400px;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
      }
      label {
        font-size: 16px;
        color: #555;
        margin-bottom: 8px;
      }
      input[type="text"],
      input[type="password"],
      input[type="email"],
      textarea {
        width: 100%;
        padding: 10px;
        margin: 8px 0 16px 0;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-sizing: border-box;
        outline: none;
        text-align: center;
      }
      textarea {
        resize: vertical;
      }
      input[type="submit"] {
        background-color: #4CAF50;
        color: white;
        padding: 12px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
      }
      input[type="submit"]:hover {
        background-color: #45a049;
      }
    </style>
  </head>
  <body>
    <h2>Green Tech Registration</h2>
    <form action="/save" method="post">
      <label for="ssid">Wi-Fi SSID:</label><br>
      <input type="text" id="ssid" name="ssid" required><br>
  
      <label for="password">Password:</label><br>
      <input type="password" id="password" name="password" required><br>
  
      <label for="email">User Email: </label><br>
      <input type="email" id="email" name="email" required><br>
  
      <input type="submit" value="Save and Restart">
    </form>
  </body>
  </html>
  )rawliteral";  

const char* rebootPage = R"rawliteral(
  <!DOCTYPE html>
  <html>
  <head>
    <title>Rebooting...</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f0f2f5;
        padding: 20px;
        text-align: center;
      }
      h2 {
        color: #333;        
      }
      p {
        font-size: 18px;
        color: #555;
      }
    </style>
  </head>
  <body>
    <h2>Rebooting...</h2>
    <p>Credentials saved! device will restart soon.</p>
  </body>
  </html>
  )rawliteral";

void startAccessPoint() {
  WiFi.softAP("ESP32-Setup", "esp32pass");
  IPAddress IP = WiFi.softAPIP();
  Serial.println("AP IP: " + IP.toString());

  server.on("/", HTTP_GET, []() {
    server.send(200, "text/html", RegisterForm);
  });

  server.on("/save", HTTP_POST, []() {
    ssid = server.arg("ssid");
    password = server.arg("password");
    email = server.arg("email");
    saveCredentials();
    delay(1000);
    server.send(200, "text/html", rebootPage);
    delay(2000);
    ESP.restart();
  });

  server.begin();
}

void loadCredentials() {
  EEPROM.begin(1024);
  ssid = EEPROM.readString(0);
  password = EEPROM.readString(100);
  email = EEPROM.readString(200);
  registered = EEPROM.read(290) != 0;
  deviceId = EEPROM.read(300);
  plantId = EEPROM.read(310);
  hasThresholds = EEPROM.read(320) != 0;
  if (hasThresholds) {
    for (int i = 0; i < 2; i++) {
      moistureThreshold[i] = EEPROM.readFloat(400 + i * sizeof(float));
      temperatureThreshold[i] = EEPROM.readFloat(400 + 2 * sizeof(float) + i * sizeof(float));
      humidityThreshold[i] = EEPROM.readFloat(400 + 4 * sizeof(float) + i * sizeof(float));
    }
    for (int i = 0; i < 3; i++) {
      nutrientThreshold[i] = EEPROM.readFloat(400 + 6 * sizeof(float) + i * sizeof(float));
    }
  }
  EEPROM.end();

  certString = readFileAsString(SPIFFS, "/cert.pem");
  privateKeyString = readFileAsString(SPIFFS, "/priv.key");
  thingNameString = readFileAsString(SPIFFS, "/thingName.txt");
  endpointString = readFileAsString(SPIFFS, "/endpoint.txt");
  
  // Point const char* to String c_str() - these remain valid as long as String objects exist
  AWS_CERT_CRT = certString.length() > 0 ? certString.c_str() : nullptr;
  AWS_CERT_PRIVATE = privateKeyString.length() > 0 ? privateKeyString.c_str() : nullptr;
  THINGNAME = thingNameString.length() > 0 ? thingNameString.c_str() : nullptr;
  AWS_IOT_ENDPOINT = endpointString.length() > 0 ? endpointString.c_str() : nullptr;
}

bool sendRegistrationToBackend() {
  HTTPClient http;
  WiFiClient client;

  http.setTimeout(10000);
  
  http.begin(client, "http://192.168.155.83:8080/api/v1/device/addDevice");
  http.addHeader("Content-Type", "application/json");

  JsonDocument doc;
  doc["mac"] = WiFi.macAddress();
  doc["email"] = email;
  String payload;
  serializeJson(doc, payload);

  Serial.println("Sending registration request...");
  Serial.println("Payload: " + payload);
  
  int code = http.POST(payload);
  Serial.println("HTTP Response Code: " + String(code));

  if (code > 0) {
    String response = http.getString();
    
    if (code == 200) {
      JsonDocument respDoc;
      DeserializationError error = deserializeJson(respDoc, response);

      if (error) {
        Serial.print("JSON Parse Error: ");
        Serial.println(error.c_str());
        http.end();
        return false;
      }

      // Debug: Print all keys in the response
      Serial.println("Response keys available:");
      for (JsonPair kv : respDoc.as<JsonObject>()) {
        Serial.println("  " + String(kv.key().c_str()));
      }

      // Extract credentials safely and store in String objects first
      certString = respDoc["certificatePem"].as<String>();
      privateKeyString = respDoc["privateKey"].as<String>();
      endpointString = respDoc["endpoint"].as<String>();
      thingNameString = respDoc["thingName"].as<String>();
      deviceId = respDoc["deviceId"]["id"];
      
      // Point const char* to the String objects
      AWS_CERT_CRT = certString.c_str();
      AWS_CERT_PRIVATE = privateKeyString.c_str();
      AWS_IOT_ENDPOINT = endpointString.c_str();
      THINGNAME = thingNameString.c_str();
      
      Serial.println("Device ID: " + String(deviceId));
      Serial.println("Thing Name: " + String(THINGNAME));
      Serial.println("Endpoint: " + String(AWS_IOT_ENDPOINT));
      Serial.println("Certificate length: " + String(certString.length()));
      Serial.println("Private key length: " + String(privateKeyString.length()));

      // Save to SPIFFS
      writeFile(SPIFFS, "/cert.pem", AWS_CERT_CRT);
      writeFile(SPIFFS, "/priv.key", AWS_CERT_PRIVATE);
      writeFile(SPIFFS, "/thingName.txt", THINGNAME);
      writeFile(SPIFFS, "/endpoint.txt", AWS_IOT_ENDPOINT);

      Serial.println("Device registered and credentials stored.");
      
      // Mark as registered
      EEPROM.begin(512);
      EEPROM.write(290, 1);
      EEPROM.write(300, deviceId);
      EEPROM.commit();
      EEPROM.end();
      
      http.end();
      return true;
    } else {
      Serial.println("Registration failed with code: " + String(code));
      Serial.println("Response: " + response);
    }
  } else {
    Serial.println("HTTP request failed with error code: " + String(code));
  }

  http.end();
  return false;
}

bool sendRegistrationWithRetry() {
  for (int i = 0; i < 5; i++) {
    Serial.println("Registration attempt #" + String(i+1));
    
    // Check WiFi connection before each attempt
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("WiFi disconnected during registration");
      return false;
    }
    
    if (sendRegistrationToBackend()) {
      Serial.println("Registration successful on attempt #" + String(i+1));
      return true;
    }
    
    Serial.println("Registration attempt #" + String(i+1) + " failed");

    if (i < 4) { // Don't delay after the last attempt
      Serial.println("Waiting 3 seconds before next attempt...");
      delay(3000);
    }
  }
  Serial.println("All registration attempts failed");
  return false;
}

void tryConnectToWiFi() {
  loadCredentials();

  if (ssid == "" || password == "" || email == "") {
    Serial.println("No credentials found. Starting AP mode.");
    WiFi.disconnect(true);
    WiFi.mode(WIFI_AP);
    startAccessPoint();
    return;
  }

  Serial.println("Connecting to WiFi: " + ssid);
  WiFi.begin(ssid.c_str(), password.c_str());

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    retries++;
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected to Wi-Fi!");
    Serial.println("IP address: " + WiFi.localIP().toString());
    Serial.println("MAC address: " + WiFi.macAddress());
    
    // Wait for valid IP
    int ipWaitCount = 0;
    while (WiFi.localIP().toString() == "0.0.0.0" && ipWaitCount < 50) {
      delay(100);
      ipWaitCount++;
    }
    
    if (WiFi.localIP().toString() == "0.0.0.0") {
      Serial.println("Failed to get valid IP address");
      WiFi.disconnect(true);
      WiFi.mode(WIFI_AP);
      startAccessPoint();
      return;
    }
    
    if (registered == 1) {
      Serial.println("Device already registered.");
      return;
    }
    
    Serial.println("Starting device registration...");
    if (!sendRegistrationWithRetry()) {
      Serial.println("Device registration failed after all attempts");
      // Optionally, you could start AP mode here for reconfiguration
    }
    delay(3000);
    ESP.restart();
  } else {
    Serial.println("Failed to connect to WiFi");
    WiFi.disconnect(true);
    WiFi.mode(WIFI_AP);
    startAccessPoint();
  }
}