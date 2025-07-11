package com.Green_Tech.Green_Tech.Service.sensorData;

import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.DTO.DailySensorAverageDTO;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Entity.SensorData;
import com.Green_Tech.Green_Tech.Repository.DeviceRepo;
import com.Green_Tech.Green_Tech.Repository.SensorDataRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SensorDataService {

    @Autowired
    private SensorDataRepository sensorDataRepository;
    @Autowired
    private DeviceRepo deviceRepo;
    @Autowired
    private SensorWebSocketService sensorWebSocketService;

    public Map<String, Object> getSensorData(Long id) {
        SensorData data = sensorDataRepository.findFirstByDeviceIdOrderByIdDesc(id);

        return getSensorDataFormat(data);
    }

    public HashMap convertByteArrayToHashMap(byte[] jsonData) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(jsonData, HashMap.class);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public void getDataFromAWS(byte[] data) throws DeviceNotFoundException {
        HashMap awsData = convertByteArrayToHashMap(data);
        if (awsData == null) {
            throw new IllegalArgumentException("Failed to parse AWS data");
        }

        String mac = (String) awsData.get("mac");
        if (mac == null) {
            throw new IllegalArgumentException("MAC address is missing in AWS data");
        }

        Device device = deviceRepo.findByMac(mac);
        if (device == null) {
            throw new DeviceNotFoundException("Device not found for MAC: " + mac);
        }

        SensorData sensorData = SensorData.builder()
                .device(device)
                .humidity(parseDouble(awsData.get("humidity")))
                .soilMoisture(parseDouble(awsData.get("moisture")))
                .temperature(parseDouble(awsData.get("temperature")))
                .nitrogenLevel(parseDouble(awsData.get("nitrogenLevel")))
                .phosphorusLevel(parseDouble(awsData.get("phosphorusLevel")))
                .potassiumLevel(parseDouble(awsData.get("potassiumLevel")))
                .actuatorStatus(convertListToBoolArray((List<Boolean>) awsData.get("actuatorState")))
                .updatedAt(new Date())
                .build();

        sensorDataRepository.save(sensorData);

        // send the data through the websocket
        sensorWebSocketService.sendSensorData(device.getId(), getSensorDataFormat(sensorData));
    }

    private double parseDouble(Object value) {
        if (value == null) return 0.0;
        if (value instanceof Integer) return ((Integer) value).doubleValue();
        if (value instanceof Double) return (Double) value;
        if (value instanceof Float) return ((Float) value).doubleValue();
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }


    public Map<String, Object> getSensorDataFormat(SensorData data){
        Map<String, Object> sensorData = new HashMap<>();
        sensorData.put("temperature", data.getTemperature());
        sensorData.put("humidity", data.getHumidity());
        sensorData.put("soilMoisture", data.getSoilMoisture());
        sensorData.put("nitrogenLevel", data.getNitrogenLevel());
        sensorData.put("phosphorusLevel", data.getPhosphorusLevel());
        sensorData.put("potassiumLevel", data.getPotassiumLevel());
        sensorData.put("actuatorStatus", data.getActuatorStatus());

        return sensorData;
    }

    private boolean[] convertListToBoolArray(List<Boolean> list) {
        boolean[] result = new boolean[list.size()];
        for (int i = 0; i < list.size(); i++) {
            result[i] = list.get(i);
        }
        return result;
    }

    public List<DailySensorAverageDTO> getSummary(Long id, Map<String, Date> dateRange)
            throws DeviceNotFoundException {

        if(!deviceRepo.existsById(id)){
            throw new DeviceNotFoundException("Device not found to fetch the data");
        }

        Date start = dateRange.get("startDate");
        Date end = dateRange.get("endDate");

        return sensorDataRepository.findByIdAndDateRange(id, start, end);
    }
}
