import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface HeaderProps {
  selectedZone: string;
  viewZone: boolean;
  setSelectedZone: (zone: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedZone, setSelectedZone, viewZone }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const zones: string[] = ['ZONE 1', 'ZONE 2'];

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="notifications" size={26} color="white" />
        </TouchableOpacity>

        {viewZone &&
        <View style={styles.zoneSelector}>
          <Text style={styles.zoneText}>{selectedZone}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
        </View>
        }  

        <TouchableOpacity onPress={() => router.push('Components/Manual/Manual')}>
          <Ionicons name="settings" size={26} color="white" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={zones}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedZone(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#01694D', // Green color for top bar 
    paddingVertical: 18,
    paddingHorizontal: 20,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0, 
    zIndex: 10,
  },
  zoneSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  zoneText: {
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  dropdownArrow: {
    fontSize: 25,
    color: '#16F08B',
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
});

export default Header;


