import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import GrowComponents from './GrowComponents';
import GrowData from './GrowData';
import { themeAuth } from '../../../Contexts/ThemeContext';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Axios } from '../../AxiosRequestBuilder';
import { useSensorWebSocket } from './useSensorWebSocket';
import { Ionicons } from '@expo/vector-icons';

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
  const [selectedDevice, setSelectedDevice] = useState<Device | undefined>(JSON.parse(params.zone as string)[0]);
  const [isEnabled, setIsEnabled] = useState<boolean[]>([false, false, false, false, false]);
  const { theme } = themeAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>();
  const [error, setError] = useState<string | null>(null);
  
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }

  useEffect(() => {
      if (params.zone) {
        try {
          const deviceObject = JSON.parse(params.zone as string);
          setDevices(deviceObject);
        } catch (error) {
          console.error("Error parsing device data:", error);
        }
      }
    }, [params.zone, refreshing]);

  const toggleStatus = (index: number) => {
    setIsEnabled((prevState) => {
      const newStates = [...prevState]; 
      newStates[index] = !newStates[index]; 
      return newStates;
    });
  };

  // WebSocket: receives real-time data
  useSensorWebSocket(selectedDevice?.id, (data) => {
    setSensorData(data);
    setIsEnabled(data.actuatorStatus);
  });

  // REST call: fetch latest data from DB on page focus
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          console.log(`Fetching data for device ID: ${selectedDevice?.id}`);
          
          const res = await Axios.get(`/sensors/currentData/${selectedDevice?.id}`);
          setSensorData(res.data);
          setIsEnabled(res.data.actuatorStatus);
        } catch (e) {
          console.error('REST fetch failed:', e);
          setError('Failed to fetch data');
        }
      };
      fetchData();
    }, [selectedDevice?.id])
  );

  const handleStatics = () => {
    if(!selectedDevice) return;

    router.push({pathname: "Components/Statics/Statistics",
       params: {deviceId : JSON.stringify(selectedDevice?.id)}})
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}
      refreshControl={
        <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        />
      }>
      
      <View style={[styles.zoneSelector, {backgroundColor: theme.colors.primary}]}>
          <Text style={[styles.zoneText, {color: theme.colors.text}]}>{selectedDevice?.name}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={[styles.dropdownArrow, {color: theme.colors.text}]}>▼</Text>
          </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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
                  <Text style={styles.modalText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              />
          </View>
        </View>
      </Modal>

      <View>
        <GrowComponents isEnabled={isEnabled} toggleStatus={toggleStatus} deviceId={selectedDevice?.id}/>
        <GrowData deviceId={selectedDevice?.id} sensorData={sensorData} error={error}/>
      </View>
      
      {
        selectedDevice && 
        <View style={[styles.staticsContainer]}>
          <TouchableOpacity style={[styles.staticsButton, {backgroundColor: theme.colors.primary}]} onPress={handleStatics}>
            <Ionicons name="bar-chart" size={20} color={theme.colors.text}/>
            <Text style={[styles.staticsText, {color: theme.colors.text}]}>View statistics</Text>
          </TouchableOpacity>
        </View>
      }

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04261C',
    alignItems: 'center',
    paddingTop: 10, 
  },
  zoneSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    minWidth: 180,
  },
  zoneText: {
    fontSize: 17,
    color: '#01694D',
    fontWeight: 'bold',
    marginRight: 12,
    flexShrink: 1,
    textAlign: 'center',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 22,
    color: '#01694D',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#01694D',
    width: '50%',
    padding: 10,
    borderRadius: 10,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalText: {
    fontSize: 15,
    color: "#F6FCDF",
    textAlign: 'center',
  },
  staticsContainer: {
    marginTop: 20,
    width: "90%",
  },
  staticsButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#01694D",
    paddingVertical: 13,
    borderRadius: 8
  },
  staticsText:{
    fontSize: 16,
    textAlign: "center"
  }
});

export default Zone;