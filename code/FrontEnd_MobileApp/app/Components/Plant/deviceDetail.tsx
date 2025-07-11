// PlantDeviceDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  RefreshControl,
  View
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { usePlantContext } from '../../../Contexts/PlantContext';
import { useDeviceContext } from '../../../Contexts/DeviceContext';

interface BaseItem {
  id: number;
  name: string;
  imageData?: string;
  imageType?: string;
}

interface Plant extends BaseItem {
  description: string;
  temperatureRange: string;
  humidityRange: string;
}

interface Device extends BaseItem {
  type: string;
  status: 'active' | 'inactive' | 'offline';
  lastActive: string;
}

const PlantDeviceDetailScreen = () => {
  const { plants } = usePlantContext();
  const { devices } = useDeviceContext();
  const params = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [item, setItem] = useState<Plant | Device | null>(null);
  const [isPlant, setIsPlant] = useState(false);

  useEffect(() => {
    if (params.plantId) {
      const plantId = Number(params.plantId);
      const foundPlant = plants.find(p => p.id === plantId);
      setItem(foundPlant || null);
      setIsPlant(true);
    } else if (params.deviceId) {
      const deviceId = Number(params.deviceId);
      const foundDevice = devices.find(d => d.id === deviceId);
      setItem(foundDevice || null);
      setIsPlant(false);
    }
  }, [params, plants, devices, refreshing]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const renderPlantDetails = (plant: Plant) => (
    <>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{plant.description}</Text>
      
      <Text style={styles.label}>Temperature Range:</Text>
      <Text style={styles.value}>{plant.temperatureRange}</Text>
      
      <Text style={styles.label}>Humidity Range:</Text>
      <Text style={styles.value}>{plant.humidityRange}</Text>
    </>
  );

  const renderDeviceDetails = (device: Device) => (
    <>
      <Text style={styles.label}>Type:</Text>
      <Text style={styles.value}>{device.type}</Text>
      
      <Text style={styles.label}>Status:</Text>
      <Text style={[styles.value, { color: getStatusColor(device.status) }]}>
        {device.status.toUpperCase()}
      </Text>
      
      <Text style={styles.label}>Last Active:</Text>
      <Text style={styles.value}>
        {new Date(device.lastActive).toLocaleString()}
      </Text>
    </>
  );

  const getStatusColor = (status: Device['status']) => {
    return status === 'active' ? '#4CAF50' : 
           status === 'inactive' ? '#FFC107' : '#F44336';
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {item ? (
        <>
          <Text style={styles.title}>{item.name}</Text>
          
          {item.imageData && (
            <Image
              source={{ uri: data:${item.imageType};base64,${item.imageData} }}
              style={styles.image}
            />
          )}

          {isPlant ? renderPlantDetails(item as Plant) : renderDeviceDetails(item as Device)}
        </>
      ) : (
        <Text style={styles.title}>Item not found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#012A1C',
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  label: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },
});

export default deviceDetail;