package com.Green_Tech.Green_Tech.Controller;

import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.DTO.ControlSignalRequestDTO;
import com.Green_Tech.Green_Tech.DTO.DailySensorAverageDTO;
import com.Green_Tech.Green_Tech.Entity.SensorData;
import com.Green_Tech.Green_Tech.Service.MQTT.MQTTService;
import com.Green_Tech.Green_Tech.Service.sensorData.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sensors")
@CrossOrigin
public class SensorDataController {

    @Autowired
    private SensorDataService sensorDataService;

    @Autowired
    private MQTTService mqttService;


    @GetMapping(value = "/currentData/{id}")
    public ResponseEntity<Map<String, Object>> getSensorData(@PathVariable("id") Long id) {
        return ResponseEntity.ok(sensorDataService.getSensorData(id));
    }


    @PostMapping(value = "/controlSignal")
    public String sendControlSignal(@RequestBody ControlSignalRequestDTO payload) {
        int deviceIndex = payload.getIndex();
        boolean turnOn = payload.isStatus();
        Long deviceId = payload.getDeviceId();

        mqttService.publishControlSignal("{\"index\":" + deviceIndex + ", \"status\":"+ turnOn + "}",
                deviceId, "/command");
        String[] actuators = {"fan", "nitrogen", "phosphorus", "potassium", "water"};
        return "Command Sent: " + actuators[deviceIndex] + " - " + turnOn;
    }

    @GetMapping(value = "/summary/{id}")
    public ResponseEntity<List<DailySensorAverageDTO>> getSummary(@PathVariable("id") Long id,
                                                                  @RequestParam("startDate")
                                                                  @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
                                                                  @RequestParam("endDate")
                                                                      @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate)
                                                                    throws DeviceNotFoundException {
        return ResponseEntity.ok(sensorDataService.getSummary(id, startDate, endDate));
    }

}



