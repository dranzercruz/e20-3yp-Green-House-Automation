package com.Green_Tech.Green_Tech.Service.MQTT;

import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.Entity.AwsIotCredentials;
import com.Green_Tech.Green_Tech.Repository.AwsIotCredentialsRepo;
import com.Green_Tech.Green_Tech.Service.DeviceService;
import com.Green_Tech.Green_Tech.Service.PlantService;
import com.Green_Tech.Green_Tech.Service.sensorData.SensorDataService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.crt.mqtt.*;
import software.amazon.awssdk.iot.AwsIotMqttConnectionBuilder;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MQTTService {

    @Autowired
    private SensorDataService sensorDataService;
    @Autowired
    private PlantService plantService;

    @Autowired
    private AwsIotCredentialsRepo awsIotCredentialsRepo;

    @Value("${aws.endpointUrl}")
    private String endpoint;

    private final ConcurrentHashMap<String, MqttClientConnection> deviceConnections = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Boolean> connectionStatus = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        new Thread(this::connectAllDevices).start();
    }

    public void connectAllDevices() {
        List<AwsIotCredentials> credentials = awsIotCredentialsRepo.findAllByActiveDevices(true);
        for (AwsIotCredentials aws : credentials) {
            connectAndSubscribe(aws);
        }
    }

    @Scheduled(fixedDelay = 10000)
    public void checkAndReconnectDevices() {
        List<AwsIotCredentials> credentials = awsIotCredentialsRepo.findAllByActiveDevices(true);

        for (AwsIotCredentials aws : credentials) {
            String deviceId = aws.getDevice().getId().toString();

            Boolean isConnected = connectionStatus.getOrDefault(deviceId, false);
            if (!isConnected) {
                System.out.println("🔁 Reconnecting to deviceId: " + deviceId);
                connectAndSubscribe(aws);
            }
        }
    }

    private void connectAndSubscribe(AwsIotCredentials aws) {
        String deviceId = aws.getDevice().getId().toString();

        try {
            AwsIotMqttConnectionBuilder builder = AwsIotMqttConnectionBuilder.newMtlsBuilder(
                    aws.getCertificatePem().getBytes(StandardCharsets.UTF_8),
                    aws.getPrivateKey().getBytes(StandardCharsets.UTF_8)
            );

            builder.withClientId("Green_Tech-" + deviceId)
                    .withEndpoint(endpoint)
                    .withCleanSession(false)
                    .withConnectionEventCallbacks(new MqttClientConnectionEvents() {
                        @Override
                        public void onConnectionInterrupted(int errorCode) {
                            System.err.println("❌ Connection interrupted for device " + deviceId);
                            connectionStatus.put(deviceId, false);
                        }

                        @Override
                        public void onConnectionResumed(boolean sessionPresent) {
                            System.out.println("✅ Connection resumed for device " + deviceId);
                            connectionStatus.put(deviceId, true);
                        }
                    });

            MqttClientConnection connection = builder.build();
            builder.close();

            try{
                connection.connect().get();
            }
            catch (Exception e) {
                System.out.println("❌❌❌ connection failed");
            }

            System.out.println("✅ Connected to AWS IoT: " + deviceId);

            connectionStatus.put(deviceId, true);
            deviceConnections.put(deviceId, connection);

            String topicFilter = "esp32/" + deviceId + "/+";

            connection.subscribe(topicFilter, QualityOfService.AT_LEAST_ONCE, message -> {
                String payload = new String(message.getPayload(), StandardCharsets.UTF_8);
                System.out.println("📩 [" + message.getTopic() + "] " + payload);
                String[] topicParts = message.getTopic().split("/");
                String command = topicParts[2];
                try {
                    if ("data".equals(command)) {
                        sensorDataService.getDataFromAWS(message.getPayload());
                    } else if ("thresholdConfirmation".equals(command)) {
                        plantService.thresholdConfirmation(message.getPayload());
                    }
                } catch (DeviceNotFoundException e) {
                    System.err.println("❌ Device not found while processing message");
                    e.printStackTrace();
                }
            }).get();

        } catch (Exception e) {
            System.err.println("❌ Failed to connect/subscribe for deviceId: " + deviceId);
            connectionStatus.put(deviceId, false);
            e.printStackTrace();
        }
    }

    public void publishControlSignal(String message, Long deviceId, String operation) {
        try {
            AwsIotCredentials aws = awsIotCredentialsRepo.findByDeviceId(deviceId);

            AwsIotMqttConnectionBuilder builder = AwsIotMqttConnectionBuilder.newMtlsBuilder(
                    aws.getCertificatePem().getBytes(StandardCharsets.UTF_8),
                    aws.getPrivateKey().getBytes(StandardCharsets.UTF_8)
            );

            builder.withClientId("Green_Tech_command-" + deviceId)
                    .withEndpoint(endpoint)
                    .withCleanSession(true);

            MqttClientConnection connection = builder.build();
            builder.close();

            connection.connect().get();

            byte[] payload = message.getBytes(StandardCharsets.UTF_8);
            String topic = "esp32/" + deviceId + operation;

            MqttMessage mqttMessage = new MqttMessage(topic, payload, QualityOfService.AT_LEAST_ONCE);
            connection.publish(mqttMessage).get();

            System.out.println("✅ Published control signal to device " + deviceId);

            connection.disconnect();

        } catch (Exception e) {
            System.err.println("❌ Failed to publish control signal to deviceId: " + deviceId);
            e.printStackTrace();
        }
    }
}
