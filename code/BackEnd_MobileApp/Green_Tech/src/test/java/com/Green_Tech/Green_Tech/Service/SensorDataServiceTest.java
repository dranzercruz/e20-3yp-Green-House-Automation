//package com.Green_Tech.Green_Tech.Service;
//
//import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
//import com.Green_Tech.Green_Tech.Entity.Device;
//import com.Green_Tech.Green_Tech.Entity.SensorData;
//import com.Green_Tech.Green_Tech.Repository.DeviceRepo;
//import com.Green_Tech.Green_Tech.Repository.SensorDataRepository;
//import com.Green_Tech.Green_Tech.Service.sensorData.SensorDataService;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.*;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import java.nio.charset.StandardCharsets;
//import java.util.*;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//class SensorDataServiceTest {
//
//    @InjectMocks
//    private SensorDataService sensorDataService;
//
//    @Mock
//    private SensorDataRepository sensorDataRepository;
//
//    @Mock
//    private DeviceRepo deviceRepo;
//
//    @Test
//    void testGetSensorData_validId_returnsSensorMap() {
//        SensorData data = SensorData.builder()
//                .temperature(25.5)
//                .humidity(60.0)
//                .soilMoisture(40.0)
//                .nitrogenLevel(15.0)
//                .phosphorusLevel(10.0)
//                .potassiumLevel(20.0)
//                .actuatorStatus(new boolean[]{true, false})
//                .build();
//
//        when(sensorDataRepository.findFirstByDeviceIdOrderByIdDesc(1L)).thenReturn(data);
//
//        Map<String, Object> result = sensorDataService.getSensorData(1L);
//
//        assertEquals(25.5, result.get("temperature"));
//        assertEquals(60.0, result.get("humidity"));
//        assertEquals(40.0, result.get("soilMoisture"));
//        assertEquals(15.0, result.get("nitrogenLevel"));
//        assertEquals(10.0, result.get("phosphorusLevel"));
//        assertEquals(20.0, result.get("potassiumLevel"));
//        assertArrayEquals(new boolean[]{true, false}, (boolean[]) result.get("actuatorStatus"));
//    }
//
//    @Test
//    void testGetSensorData_noData_throwsNullPointer() {
//        when(sensorDataRepository.findFirstByDeviceIdOrderByIdDesc(1L)).thenReturn(null);
//        assertThrows(NullPointerException.class, () -> sensorDataService.getSensorData(1L));
//    }
//
//    @Test
//    void testConvertByteArrayToHashMap_validJson_returnsMap() {
//        String json = "{\"mac\":\"AA:BB:CC\",\"temperature\":24}";
//        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
//
//        HashMap result = sensorDataService.convertByteArrayToHashMap(bytes);
//
//        assertEquals("AA:BB:CC", result.get("mac"));
//        assertEquals(24, result.get("temperature"));
//    }
//
//    @Test
//    void testConvertByteArrayToHashMap_invalidJson_returnsNull() {
//        byte[] invalid = "{invalidJson}".getBytes(StandardCharsets.UTF_8);
//        HashMap result = sensorDataService.convertByteArrayToHashMap(invalid);
//        assertNull(result);
//    }
//
//    @Test
//    void testGetDataFromAWS_validInput_savesSensorData() throws DeviceNotFoundException {
//        String json = """
//        {
//            "mac": "AA:BB:CC",
//            "temperature": 25,
//            "humidity": 65,
//            "moisture": 32,
//            "nitrogenLevel": 15,
//            "phosphorusLevel": 10,
//            "potassiumLevel": 20,
//            "actuatorState": [true, false]
//        }
//        """;
//
//        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
//        Device device = new Device();
//
//        when(deviceRepo.findByMac("AA:BB:CC")).thenReturn(device);
//
//        sensorDataService.getDataFromAWS(bytes);
//
//        ArgumentCaptor<SensorData> captor = ArgumentCaptor.forClass(SensorData.class);
//        verify(sensorDataRepository, times(1)).save(captor.capture());
//
//        SensorData saved = captor.getValue();
//        assertEquals(25.0, saved.getTemperature());
//        assertEquals(65.0, saved.getHumidity());
////        assertEquals(30.0, saved.getSoilMoisture());
//        assertEquals(15.0, saved.getNitrogenLevel());
//        assertEquals(10.0, saved.getPhosphorusLevel());
//        assertEquals(20.0, saved.getPotassiumLevel());
//        assertArrayEquals(new boolean[]{true, false}, saved.getActuatorStatus());
//        assertNotNull(saved.getUpdatedAt());
//        assertEquals(device, saved.getDevice());
//    }
//
////    @Test
////    void testGetDataFromAWS_deviceNotFound_throwsNullPointer() {
////        String json = """
////        {
////            "mac": "NOT_EXIST",
////            "temperature": 25,
////            "humidity": 65,
////            "moisture": 30,
////            "nitrogenLevel": 15,
////            "phosphorusLevel": 10,
////            "potassiumLevel": 20,
////            "actuatorState": [true, false]
////        }
////        """;
////
////        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
////        when(deviceRepo.findByMac("NOT_EXIST")).thenReturn(null);
////
////        // Will throw NullPointer because device is null and used in builder
//////        assertThrows(NullPointerException.class, () -> sensorDataService.getDataFromAWS(bytes));
////    }
//}
