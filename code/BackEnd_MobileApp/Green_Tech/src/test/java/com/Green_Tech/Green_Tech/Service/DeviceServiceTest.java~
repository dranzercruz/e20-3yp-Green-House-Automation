package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.CustomException.DeviceAlreadyFoundException;
import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.CustomException.PlantNotFoundException;
import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.DTO.DeviceDTO;
import com.Green_Tech.Green_Tech.Entity.AwsIotCredentials;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Entity.User;
import com.Green_Tech.Green_Tech.Repository.AwsIotCredentialsRepo;
import com.Green_Tech.Green_Tech.Repository.DeviceRepo;
import com.Green_Tech.Green_Tech.Repository.SensorDataRepository;
import com.Green_Tech.Green_Tech.Repository.UserRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DeviceServiceTest {

   @Mock
   private DeviceRepo deviceRepository;

   @Mock
   private UserRepo userRepo;

   @Mock
   private ExtractUserService extractUserService;

   @Mock
   private AwsIotProvisioningService awsIotProvisioningService;

   @Mock
   private AwsIotCredentialsRepo awsIotCredentialsRepo;

   @Mock
   private SensorDataRepository sensorDataRepository;

   @InjectMocks
   private DeviceService deviceService;

   @BeforeEach
   void setup() {
      MockitoAnnotations.openMocks(this);
   }

   @Test
   void testGetAllDevices_ReturnsList() {
      List<Device> devices = List.of(new Device(), new Device());
      when(deviceRepository.findAll()).thenReturn(devices);

      List<Device> result = deviceService.getAllDevices("auth-token");

      assertEquals(2, result.size());
      verify(deviceRepository).findAll();
   }

   @Test
   void testGetDevicesByUser_ReturnsDevices() throws UserNotFoundException {
      User user = new User();
      List<Device> devices = List.of(new Device(), new Device());
      when(extractUserService.extractUserFromJwt("auth-token")).thenReturn(user);
      when(deviceRepository.findByUserAndActive(user, false)).thenReturn(devices);

      List<Device> result = deviceService.getDevicesByUser("auth-token");

      assertEquals(devices, result);
      verify(deviceRepository).findByUserAndActive(user, false);
   }

   @Test
   void testGetDevicesByUser_UserNotFound_ThrowsException() throws UserNotFoundException {
      when(extractUserService.extractUserFromJwt("auth-token")).thenThrow(new UserNotFoundException("User not found"));

      assertThrows(UserNotFoundException.class, () -> deviceService.getDevicesByUser("auth-token"));
   }

   @Test
   void testGetActiveDevicesByUser_ReturnsDevices() throws UserNotFoundException {
      User user = new User();
      List<Device> devices = List.of(new Device(), new Device());
      when(extractUserService.extractUserFromJwt("auth-token")).thenReturn(user);
      when(deviceRepository.findByUserAndActive(user, true)).thenReturn(devices);

      List<DeviceDTO> result = deviceService.getActiveDevicesByUser("auth-token");

      assertEquals(devices, result);
      verify(deviceRepository).findByUserAndActive(user, true);
   }

   @Test
   void testCreateDevice_DeviceAlreadyExists_ReturnsExistingCredentials() throws UserNotFoundException {
      String mac = "00:11:22:33:44";
      Map<String, String> data = Map.of("email", "test@example.com", "mac", mac);
      User user = new User();
      Device device = Device.builder().id(1L).mac(mac).build();
      AwsIotCredentials credentials = AwsIotCredentials.builder().device(device).build();

      when(userRepo.findByEmail("test@example.com")).thenReturn(Optional.of(user));
      when(deviceRepository.existsByMac(mac)).thenReturn(true);
      when(deviceRepository.findByMac(mac)).thenReturn(device);
      when(awsIotCredentialsRepo.findByDeviceId(device.getId())).thenReturn(credentials);

      AwsIotCredentials result = deviceService.createDevice(data);

      assertEquals(credentials, result);
      verify(deviceRepository).existsByMac(mac);
      verify(deviceRepository).findByMac(mac);
      verify(awsIotCredentialsRepo).findByDeviceId(device.getId());
   }

   @Test
   void testCreateDevice_DeviceExistsNoCredentials_CreatesNewCredentials() throws UserNotFoundException {
      String mac = "00:11:22:33:44";
      Map<String, String> data = Map.of("email", "test@example.com", "mac", mac);
      User user = new User();
      Device device = Device.builder().id(1L).mac(mac).build();

      when(userRepo.findByEmail("test@example.com")).thenReturn(Optional.of(user));
      when(deviceRepository.existsByMac(mac)).thenReturn(true);
      when(deviceRepository.findByMac(mac)).thenReturn(device);
      when(awsIotCredentialsRepo.findByDeviceId(device.getId())).thenReturn(null);
      when(awsIotProvisioningService.createThing(mac)).thenReturn(AwsIotCredentials.builder().device(device).build());

      AwsIotCredentials result = deviceService.createDevice(data);

      assertNotNull(result);
      verify(awsIotProvisioningService).createThing(mac);
   }

   @Test
   void testCreateDevice_NewDevice_SavesAndCreatesCredentials() throws UserNotFoundException {
      String mac = "00:11:22:33:44";
      Map<String, String> data = Map.of("email", "test@example.com", "mac", mac);
      User user = new User();

      when(userRepo.findByEmail("test@example.com")).thenReturn(Optional.of(user));
      when(deviceRepository.existsByMac(mac)).thenReturn(false);
      when(awsIotProvisioningService.createThing(mac)).thenReturn(AwsIotCredentials.builder().build());

      AwsIotCredentials result = deviceService.createDevice(data);

      assertNotNull(result);
      verify(deviceRepository).save(any(Device.class));
      verify(awsIotProvisioningService).createThing(mac);
   }

   @Test
   void testUpdateDevice_DeviceExists_UpdatesAndReturns() throws DeviceNotFoundException, PlantNotFoundException {
      Long id = 1L;
      Device existingDevice = Device.builder().id(id).zoneName("oldZone").name("oldName").location("oldLoc").build();
      Map<String, String> updatedData = Map.of("zoneName", "newZone", "name", "newName", "location", "newLoc");

      when(deviceRepository.findById(id)).thenReturn(Optional.of(existingDevice));
      when(deviceRepository.save(existingDevice)).thenReturn(existingDevice);

      Device updatedDevice = deviceService.updateDevice(id, updatedData);

      assertEquals("newZone", updatedDevice.getZoneName());
      assertEquals("newName", updatedDevice.getName());
      assertEquals("newLoc", updatedDevice.getLocation());
      verify(deviceRepository).save(existingDevice);
   }

   @Test
   void testUpdateDevice_DeviceNotFound_ThrowsException() {
      Long id = 1L;
      Map<String, String> updatedData = Map.of("zoneName", "newZone", "name", "newName", "location", "newLoc");

      when(deviceRepository.findById(id)).thenReturn(Optional.empty());

      assertThrows(DeviceNotFoundException.class, () -> deviceService.updateDevice(id, updatedData));
   }

   @Test
   void testDeleteDevice_DeviceExists_DeletesAll() throws DeviceNotFoundException {
      Long id = 1L;

      when(deviceRepository.existsById(id)).thenReturn(true);
      doNothing().when(awsIotCredentialsRepo).deleteByDeviceId(id);
      doNothing().when(sensorDataRepository).deleteAllByDeviceId(id);
      doNothing().when(deviceRepository).deleteById(id);

      boolean result = deviceService.deleteDevice(id);

      assertTrue(result);
      verify(awsIotCredentialsRepo).deleteByDeviceId(id);
      verify(sensorDataRepository).deleteAllByDeviceId(id);
      verify(deviceRepository).deleteById(id);
   }

   @Test
   void testDeleteDevice_DeviceNotFound_ThrowsException() {
      Long id = 1L;

      when(deviceRepository.existsById(id)).thenReturn(false);

      assertThrows(DeviceNotFoundException.class, () -> deviceService.deleteDevice(id));
   }

   @Test
   void testActivateDevice_DeviceExists_ActivatesAndReturns() throws DeviceNotFoundException {
      Long id = 1L;
      Device device = Device.builder().id(id).active(false).build();

      when(deviceRepository.findById(id)).thenReturn(Optional.of(device));
      when(deviceRepository.save(device)).thenReturn(device);

      Device activatedDevice = deviceService.activateDevice(id);

      assertTrue(activatedDevice.isActive());
      verify(deviceRepository).save(device);
   }

   @Test
   void testActivateDevice_DeviceNotFound_ThrowsException() {
      Long id = 1L;

      when(deviceRepository.findById(id)).thenReturn(Optional.empty());

      assertThrows(DeviceNotFoundException.class, () -> deviceService.activateDevice(id));
   }

   @Test
   void testGetActiveDevicesByZone_GroupsDevicesByZone() throws UserNotFoundException {
      User user = new User();
      Device device1 = Device.builder().zoneName("ZoneA").build();
      Device device2 = Device.builder().zoneName("ZoneA").build();
      Device device3 = Device.builder().zoneName("ZoneB").build();
      device1.setUser(user);
      device2.setUser(user);
      device3.setUser(user);

      List<Device> activeDevices = List.of(device1, device2, device3);

      when(extractUserService.extractUserFromJwt("auth-token")).thenReturn(user);
      when(deviceRepository.findByUserAndActive(user, true)).thenReturn(activeDevices);

      Map<String, List<Device>> zoneMap = deviceService.getActiveDevicesByZone("auth-token");

      assertEquals(2, zoneMap.size());
      assertTrue(zoneMap.containsKey("ZoneA"));
      assertTrue(zoneMap.containsKey("ZoneB"));
      assertEquals(2, zoneMap.get("ZoneA").size());
      assertEquals(1, zoneMap.get("ZoneB").size());

      // Verify that user image data fields are nulled in getDeviceDetails
      for (List<Device> devices : zoneMap.values()) {
         for (Device d : devices) {
            assertNull(d.getUser().getImageData());
            assertNull(d.getUser().getImageName());
            assertNull(d.getUser().getImageType());
         }
      }
   }
}
