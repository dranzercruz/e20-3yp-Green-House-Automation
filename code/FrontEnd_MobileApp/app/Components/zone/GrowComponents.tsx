import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Axios } from '../../AxiosRequestBuilder';
import { themeAuth } from '../../../Contexts/ThemeContext';

interface GrowComponentsProps {
  isEnabled: boolean[];
  toggleStatus: (index: number) => void;
  deviceId: number | undefined;
}

const GrowComponents: React.FC<GrowComponentsProps> = ({ isEnabled, toggleStatus, deviceId }) => {
  const { theme } = themeAuth();

  const sendControlSignal = async (index: number, status: boolean) => {
    try {
      const response = await Axios.post("/sensors/controlSignal", {index, status, deviceId});
      toggleStatus(index); // Update UI state
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={[styles.section, { backgroundColor: theme.colors.primary }]}>
      <Text style={[styles.title, {color: theme.colors.text}]}>GROW COMPONENTS</Text>
      <View style={styles.growContainer}>
        {[
          { name: 'Fan', icon: 'flower', isOn: isEnabled[0] },
          { name: 'Nitrogen', icon: 'flask', isOn: isEnabled[1] },
          { name: 'Phosphorus', icon: 'flask', isOn: isEnabled[2] },
          { name: 'Potassium', icon: 'flask', isOn: isEnabled[3] },
          { name: 'Water', icon: 'water', isOn: isEnabled[4] },
        ].map((item, index) => (
          <View key={index} style={styles.growItem}>
            <Text style={[styles.growLabel, {color: theme.colors.text}]}>{item.name}</Text>
            <View style={[styles.circle, isEnabled[index] ? [styles.activeCircle, { backgroundColor: theme.dark ? "#264B44" : "#acfda3ff" }] : [styles.inactiveCircle, { backgroundColor: theme.dark ? "#264B44" : "#a9a9a9ff" }]]}>
              <Ionicons name={item.icon as any} size={32} color={isEnabled[index] ? theme.dark ? '#16F08B' : '#239300ff' : theme.dark ? '#cccccc' : '#fff'} />
            </View>

            <TouchableOpacity
              style={[
                styles.statusButton,
                {
                  backgroundColor: isEnabled[index]
                    ? theme.dark
                      ? '#16F08B'
                      : '#239300ff'
                    : theme.dark
                      ? '#cccccc'
                      : '#fff'
                }
              ]}
              onPress={() => sendControlSignal(index, !isEnabled[index])}
            >
              <Ionicons name="checkmark-circle" size={18} color={isEnabled[index] ? '#01694D' : '#555'} />
              <Text style={[styles.statusText, { color: isEnabled[index] ? '#01694D' : 'gray' }]}>
                {isEnabled[index] ? 'On' : 'Off'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#01694D', 
    padding: 15,
    borderRadius: 20,
    alignItems: 'stretch',
    marginBottom: 28,
    width: '95%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  growContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  growItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  growLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16F08B', 
    marginBottom: 5,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  activeCircle: {
    backgroundColor: '#1F3C34',
  },
  inactiveCircle: {
    backgroundColor: '#264B44',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 5,
  },
  statusOn: {
    backgroundColor: '#123E2D',
  },
  statusOff: {
    backgroundColor: '#2B4240',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default GrowComponents;

