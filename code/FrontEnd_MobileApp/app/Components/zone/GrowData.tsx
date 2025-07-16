import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CircularProgressBase  } from 'react-native-circular-progress-indicator';
import { themeAuth } from '../../../Contexts/ThemeContext';

interface GrowDataItem {
  name: string;
  value: string;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  percentage: number;
}

interface GrowDataProps {
  deviceId: number | undefined;
  sensorData: any;
  error: string | null;
}

const GrowData: React.FC<GrowDataProps> = ({deviceId, sensorData, error}) => {
  const { theme } = themeAuth();
  const [growDataItems, setGrowDataItems] = useState<GrowDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const formattedData: GrowDataItem[] = [
          { name: 'Temp', value: `${sensorData?.temperature}`, unit: '°C', icon: 'thermometer', percentage: (sensorData?.temperature || 0) / 80 },
          { name: 'Humidity', value: `${sensorData?.humidity}`, unit: '%', icon: 'water', percentage: (sensorData?.humidity || 0) / 100 },
          { name: 'Soil Moisture', value: `${sensorData?.soilMoisture}`, unit: '%', icon: 'leaf', percentage: (sensorData?.soilMoisture || 0) / 4500 },
          { name: 'N Level', value: `${sensorData?.nitrogenLevel}`, unit: 'ppm', icon: 'flask', percentage: (sensorData?.nitrogenLevel || 0) / 200 },
          { name: 'P Level', value: `${sensorData?.phosphorusLevel}`, unit: 'ppm', icon: 'flask', percentage: (sensorData?.phosphorusLevel || 0) / 200 },
          { name: 'K Level', value: `${sensorData?.potassiumLevel}`, unit: 'ppm', icon: 'flask', percentage: (sensorData?.potassiumLevel || 0) / 200 },
        ];
    setGrowDataItems(formattedData);
    setLoading(false);
  },[sensorData, deviceId]);


  if (loading) {
    return <ActivityIndicator size="large" color="#16F08B" />;
  }

  if (error) {
    return <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>;
  }

  const firstRow = growDataItems.slice(0, 3);
  const secondRow = growDataItems.slice(3, 6);

  return (
    <View style={[styles.growDataSection, { backgroundColor: theme.colors.primary }]}>
      <Text style={[styles.growDataMainTitle, {color: theme.colors.text}]}>GROW DATA</Text>

      <View style={styles.rowContainer}>
        {firstRow.map((item, index) => (
          <View key={index} style={styles.growDataItem}>
            <Text style={[styles.growDataTitle, {color: theme.colors.text}]}>{item.name}</Text>
            <CircularProgressBase
              value={(item.percentage || 0) * 100} // Convert to 0-100%
              radius={40}
              duration={1000}
              
              activeStrokeColor="#16F08B"
              inActiveStrokeColor="#01694D"
              inActiveStrokeOpacity={0.5}
              activeStrokeWidth={5}
              inActiveStrokeWidth={5}
            >
              <View style={styles.iconOverlay}>
                <Text style={[styles.circleValue, { color: theme.colors.text }]}>{item.value}</Text>
                <Text style={[styles.unitText, { color: theme.colors.text }]}>{item.unit}</Text>
                <Ionicons name={item.icon} size={20} color="#16F08B" style={styles.iconInside} />
              </View>
            </CircularProgressBase>
          </View>
        ))}
      </View>

      <View style={styles.rowContainer}>
        {secondRow.map((item, index) => (
          <View key={index} style={styles.growDataItem}>
            <Text style={[styles.growDataTitle, { color: theme.colors.text }]}>{item.name}</Text>
            <CircularProgressBase
              value={(item.percentage || 0) * 100} // Convert to 0-100%
              radius={40}
              duration={1000}
              activeStrokeColor="#16F08B"
              inActiveStrokeColor="#01694D"
              inActiveStrokeOpacity={0.5}
              activeStrokeWidth={5}
              inActiveStrokeWidth={5}
            >
              <View style={styles.iconOverlay}>
                <Text style={[styles.circleValue, { color: theme.colors.text }]}>{item.value}</Text>
                <Text style={[styles.unitText, { color: theme.colors.text }]}>{item.unit}</Text>
                <Ionicons name={item.icon} size={20} color="#16F08B" style={styles.iconInside} />
              </View>
            </CircularProgressBase>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  growDataSection: {
    backgroundColor: '#01694D',
    padding: 15,
    borderRadius: 20,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  growDataMainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    width: '100%',
    marginBottom: 15,
  },
  growDataItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, 
  },
  growDataTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16F08B',
    marginBottom: 5,
  },
   
  iconOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  unitText: {
    fontSize: 12,
    color: 'white',
  },
  iconInside: {
    marginTop: 5,
  },
});

export default GrowData;


