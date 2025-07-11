// import React, { useCallback, useEffect, useState } from 'react';
// import { View, StyleSheet, ScrollView, RefreshControl, Alert, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
// import GrowComponents from './GrowComponents';
// import GrowData from './GrowData';
// import { themeAuth } from '../../../Contexts/ThemeContext';
// import { useFocusEffect, useLocalSearchParams } from 'expo-router';
// import { Axios } from '../../AxiosRequestBuilder';
// import { useSensorWebSocket } from './useSensorWebSocket';

// type Device = {
//   id: number;
//   mac: string;
//   name: string;
//   zoneName: string;
//   location: string;
//   addedAt: string;
//   userId: number;
// };

// type SensorData = {
//   temperature: number;
//   humidity: number;
//   soilMoisture: number;
//   nitrogenLevel: number;
//   phosphorusLevel: number;
//   potassiumLevel: number;
//   actuatorStatus: boolean[];
// };

// const Zone: React.FC = () => {
//   const [modalVisible, setModalVisible] = useState<boolean>(false);
//   const [devices, setDevices] = useState<Device[]>([]);
//   const params = useLocalSearchParams();
//   const [selectedDevice, setSelectedDevice] = useState<Device | undefined>(JSON.parse(params.zone as string)[0]);
//   const [isEnabled, setIsEnabled] = useState<boolean[]>([false, false, false, false, false]);
//   const { theme } = themeAuth();
//   const [refreshing, setRefreshing] = useState(false);
//   const [sensorData, setSensorData] = useState<SensorData>();
//   const [error, setError] = useState<string | null>(null);
  
//   const onRefresh = () => {
//     setRefreshing(true);
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 1500);
//   }

//   useEffect(() => {
//       if (params.zone) {
//         try {
//           const deviceObject = JSON.parse(params.zone as string);
//           setDevices(deviceObject);
//         } catch (error) {
//           console.error("Error parsing device data:", error);
//         }
//       }
//     }, [params.zone, refreshing]);

//   const toggleStatus = (index: number) => {
//     setIsEnabled((prevState) => {
//       const newStates = [...prevState]; 
//       newStates[index] = !newStates[index]; 
//       return newStates;
//     });
//   };

//   // WebSocket: receives real-time data
//   useSensorWebSocket(selectedDevice?.id, (data) => {
//     setSensorData(data);
//   });

//   // REST call: fetch latest data from DB on page focus
//   useFocusEffect(
//     useCallback(() => {
//       const fetchData = async () => {
//         try {
//           const res = await Axios.get(`/sensors/currentData/${selectedDevice?.id}`);
//           setSensorData(res.data);
//         } catch (e) {
//           console.error('REST fetch failed:', e);
//           setError('Failed to fetch data');
//         }
//       };
//       fetchData();
//     }, [selectedDevice?.id])
//   );

//   // useFocusEffect(
//   //   React.useCallback(() => {
//   //     let isActive = true;
//   //     const fetchSensorData = async () => {
//   //       try {
//   //         const response = await Axios.get(`/sensors/currentData/${selectedDevice?.id}`);
//   //         setSensorData(response.data);
//   //         setIsEnabled(response.data.actuatorStatus || [false, false, false, false, false]);
//   //       } catch (error) {
//   //         console.error('Error fetching sensor data:', error);
//   //         setError('Failed to load data');
//   //       }
//   //     }
//   //     const intervalId = setInterval(() => {
//   //       if (!isActive) return;
//   //       fetchSensorData();
//   //     }, 1000);
      
//   //     return () => {
//   //       clearInterval(intervalId);
//   //       isActive = false;
//   //     }
//   //   }, [selectedDevice?.id])
//   // );

//   return (
//     <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}
//       refreshControl={
//         <RefreshControl
//         refreshing={refreshing}
//         onRefresh={onRefresh}
//         />
//       }>
      
//       <View style={[styles.zoneSelector, {backgroundColor: theme.colors.primary}]}>
//           <Text style={[styles.zoneText, {color: theme.colors.text}]}>{selectedDevice?.name}</Text>
//           <TouchableOpacity onPress={() => setModalVisible(true)}>
//             <Text style={[styles.dropdownArrow, {color: theme.colors.text}]}>▼</Text>
//           </TouchableOpacity>
//       </View>

//       <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <FlatList
//               data={devices}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                 style={styles.modalItem}
//                 onPress={() => {
//                   setSelectedDevice(item);
//                   setModalVisible(false);
//                 }}
//                 >
//                   <Text style={styles.modalText}>{item.name}</Text>
//                 </TouchableOpacity>
//               )}
//               />
//           </View>
//         </View>
//       </Modal>

//       <View>
//         <GrowComponents isEnabled={isEnabled} toggleStatus={toggleStatus} deviceId={selectedDevice?.id}/>
//         <GrowData deviceId={selectedDevice?.id} sensorData={sensorData} error={error}/>
//       </View>

//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#04261C',
//     alignItems: 'center',
//     paddingTop: 10, 
//   },
//   zoneSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 25,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginTop: 10,
//     marginBottom: 20,
//     minWidth: 180,
//   },
//   zoneText: {
//     fontSize: 17,
//     color: '#01694D',
//     fontWeight: 'bold',
//     marginRight: 12,
//     flexShrink: 1,
//     textAlign: 'center',
//     flex: 1,
//   },
//   dropdownArrow: {
//     fontSize: 22,
//     color: '#01694D',
//     fontWeight: 'bold',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#01694D',
//     width: '50%',
//     padding: 10,
//     borderRadius: 10,
//   },
//   modalItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   modalText: {
//     fontSize: 15,
//     color: "#F6FCDF",
//     textAlign: 'center',
//   },
// });

// export default Zone;

import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { themeAuth } from '../../../Contexts/ThemeContext';
import GrowComponents from './GrowComponents';
import GrowData from './GrowData';
import { Axios } from '../../AxiosRequestBuilder';
import { useSensorWebSocket } from './useSensorWebSocket';

type Device = {
  id: number;
  mac: string;
  name: string;
  zoneName: string;
  location: string;
  addedAt: string;
  userId: number;
};

type SensorData = {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  nitrogenLevel: number;
  phosphorusLevel: number;
  potassiumLevel: number;
  actuatorStatus: boolean[];
};

const Zone: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const params = useLocalSearchParams();
  const [selectedDevice, setSelectedDevice] = useState<Device | undefined>();
  const [isEnabled, setIsEnabled] = useState<boolean[]>([false, false, false, false, false]);
  const { theme } = themeAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Initialize selected device from params
  useEffect(() => {
    if (params.zone) {
      try {
        const deviceObject = JSON.parse(params.zone as string);
        setDevices(deviceObject);
        setSelectedDevice(deviceObject[0]);
      } catch (error) {
        console.error("Error parsing device data:", error);
      }
    }
  }, [params.zone]);

  // WebSocket connection for real-time data
  useSensorWebSocket(selectedDevice?.id, (data) => {
    setSensorData(data);
    setIsEnabled(data.actuatorStatus || [false, false, false, false, false]);
  });

  // Fetch initial data on focus
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!selectedDevice?.id) return;
        
        try {
          const res = await Axios.get(`/sensors/currentData/${selectedDevice.id}`);
          setSensorData(res.data);
          setIsEnabled(res.data.actuatorStatus || [false, false, false, false, false]);
        } catch (e) {
          console.error('REST fetch failed:', e);
          setError('Failed to fetch data');
        }
      };
      fetchData();
    }, [selectedDevice?.id])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const toggleStatus = (index: number) => {
    setIsEnabled(prevState => {
      const newStates = [...prevState];
      newStates[index] = !newStates[index];
      
      // Send actuator status update to server
      if (selectedDevice?.id) {
        Axios.post(`/actuators/update`, {
          deviceId: selectedDevice.id,
          actuatorStatus: newStates
        }).catch(e => console.error('Failed to update actuator status:', e));
      }
      
      return newStates;
    });
  };

  const navigateToStatistics = () => {
    if (selectedDevice) {
      router.push({
        pathname: '/statistics',
        params: { 
          deviceId: selectedDevice.id.toString(),
          deviceName: selectedDevice.name 
        }
      });
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      {/* Device Selection Header */}
      <View style={[styles.headerContainer, {backgroundColor: theme.colors.card}]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, {color: theme.colors.primary}]}>←</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deviceSelector}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.deviceName, {color: theme.colors.text}]} numberOfLines={1}>
            {selectedDevice?.name || 'Select Device'}
          </Text>
          <Text style={[styles.dropdownArrow, {color: theme.colors.text}]}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Device Selection Modal */}
      <Modal 
        visible={modalVisible} 
        transparent 
        animationType="fade" 
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContainer, {backgroundColor: theme.colors.card}]}>
            <FlatList
              data={devices}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedDevice(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalText, {color: theme.colors.text}]}>{item.name}</Text>
                  <Text style={[styles.modalSubtext, {color: theme.colors.secondary}]}>
                    {item.zoneName}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={[styles.separator, {backgroundColor: theme.colors.border}]} />
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <GrowComponents 
          isEnabled={isEnabled} 
          toggleStatus={toggleStatus} 
          deviceId={selectedDevice?.id}
          colors={{
            primary: theme.colors.primary,
            secondary: theme.colors.secondary,
            background: theme.colors.card,
            text: theme.colors.text
          }}
        />

        <GrowData 
          deviceId={selectedDevice?.id} 
          sensorData={sensorData} 
          error={error}
          colors={{
            primary: theme.colors.primary,
            secondary: theme.colors.secondary,
            background: theme.colors.card,
            text: theme.colors.text
          }}
        />

        {/* Statistics Button */}
        {selectedDevice && (
          <TouchableOpacity 
            style={[
              styles.statsButton, 
              {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.border
              }
            ]}
            onPress={navigateToStatistics}
          >
            <Text style={[styles.statsButtonText, {color: theme.colors.text}]}>
              View Detailed Statistics
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 24,
  },
  deviceSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  dropdownArrow: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    marginHorizontal: 30,
    borderRadius: 12,
    maxHeight: '60%',
  },
  modalItem: {
    padding: 16,
  },
  modalText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
  contentContainer: {
    padding: 16,
  },
  statsButton: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statsButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Zone;