import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Axios } from "../../AxiosRequestBuilder";
import { themeAuth } from "../../../Contexts/ThemeContext";
import SelectPlant from "./SelectPlant";
import { useDeviceContext } from "../../../Contexts/DeviceContext";

type Device = {
  id: number;
  mac: string;
  name: string;
  zoneName: string;
  location: string;
  addedAt: string;
  active: boolean;
  user: User;
  plant: Plant;
  thresholdAssigned: boolean;
};

interface Plant {
  id: number;
  name: string;
  description: string;
  temperatureLow: number;
  temperatureHigh: number;
  humidityLow: number;
  humidityHigh: number;
  moistureLow: number;
  moistureHigh: number;
  phosphorus: number;
  nitrogen: number;
  potassium: number;
  imageData: string;
  imageType: string;
  imageName: string;
}

interface User {
  name: string;
  email: string;
  phoneNumber: number;
  imageData: string;
  imageType: string;
  imageName: string;
  authMethod?: string;
}

const DisplayDetail: React.FC = () => {
  const {devices} = useDeviceContext();
  const {theme} = themeAuth();
  const params = useLocalSearchParams();
  const [device, setDevice] = useState<Device>({
    id: 0,
    mac: "",
    name: "",
    zoneName: "",
    location: "",
    addedAt: "",
    active:false,
    thresholdAssigned: false,
    user: {
      name: "",
      email: "",
      phoneNumber: 0,
      imageData: "",
      imageType: "",
      imageName: "",
    },
    plant: {
      id: 0,
      name: "",
      description: "",
      temperatureLow: 0,
      temperatureHigh: 0,
      moistureLow: 0,
      moistureHigh: 0,
      humidityLow: 0,
      humidityHigh: 0,
      phosphorus: 0,
      nitrogen: 0,
      potassium: 0,
      imageData: "",
      imageType: "",
      imageName: "",
    },
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }

  const handleSave = async () => {
    if (!selectedPlant && device.active === true) {
      Alert.alert("Error", "Please select a plant before adding the device.");
      return;
    }
    console.log("Saving device:", device);
    
    
    try {
      const response = await Axios.put(`/device/update/${device.id}`, {
        name: device.name.trim(),
        zoneName: device.zoneName.trim(),
        location: device.location.trim(),
        plantId: selectedPlant?.id,
      });
      setDevice(response.data);
    } catch (error) {
      console.error("Error updating device:", error);
    }
    setIsEditing(false);
  };

  const handleAddDevice = async () => {
    // if (!selectedPlant) {
    //   Alert.alert("Error", "Please select a plant before adding the device.");
    //   return;
    // }
    if(device.name.trim() === "" || device.zoneName.trim() === "" || device.location.trim() === "") {
      Alert.alert("Error", "Please fill in all fields before adding the device.");
      return;
    }

    try {
      const response = await Axios.put(`/device/activate/${device.id}`, { plantId: selectedPlant ? selectedPlant.id : null });
      Alert.alert("Success", "Device added successfully");
      router.push("Components/Device/DisplayList");
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  const handleDeleteDevice = async (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this device?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await Axios.delete(`/device/delete/${id}`);
              if (response.data == true) {
                Alert.alert("Success", "Device deleted successfully");
                router.push("Components/Device/DisplayList");
              }
            } catch (error) {
              console.error("Error deleting device:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );

    return;
  };

  useEffect(() => {
    if (params.deviceId) {
      try {
        const deviceId = JSON.parse(params.deviceId as string);
        const foundDevice = devices?.find(device => device.id == deviceId);
        if (foundDevice) {
          setDevice(foundDevice);
          setSelectedPlant(foundDevice.plant);
        } else {
          setDevice({
            id: 0,
            mac: "",
            name: "",
            zoneName: "",
            location: "",
            addedAt: "",
            active: false,
            thresholdAssigned: false,
            user: {
              name: "",
              email: "",
              phoneNumber: 0,
              imageData: "",
              imageType: "",
              imageName: "",
            },
            plant: {
              id: 0,
              name: "",
              description: "",
              temperatureLow: 0,
              temperatureHigh: 0,
              moistureLow: 0,
              moistureHigh: 0,
              humidityLow: 0,
              humidityHigh: 0,
              phosphorus: 0,
              nitrogen: 0,
              potassium: 0,
              imageData: "",
              imageType: "",
              imageName: "",
            },
          });
          setSelectedPlant(null);
        }
      } catch (error) {
        console.error("Error parsing device data:", error);
      }
    }
  }, [params.device, refreshing]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => {handleDeleteDevice(device.id)}}>
            <Ionicons name="trash" size={22} color={theme.dark ? "white" : "black"} style={{marginTop: 20}}/>
          </TouchableOpacity>

          <Text style={[styles.headerTitle, {color: theme.colors.text}]}>Device Details</Text>
          {isEditing ? (
            <TouchableOpacity onPress={handleSave}>
              <Text style={[styles.saveButton, {color: theme.colors.text}]}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Ionicons
                name="create-outline"
                size={24}
                color={theme.colors.text}
                style={{marginTop: 20}}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          {!selectedPlant && device.active === true && (
            <Text style={{color: "red", fontSize: 16, marginBottom: 10}}>
              Please select a plant for this device.
            </Text>
          )}

          <Text style={styles.sectionTitle}>MAC INFO</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>ID</Text>
            <Text style={styles.fieldValue}>{device.id}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>MAC Address</Text>
            <Text style={styles.fieldValue}>{device.mac}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Added At</Text>
            <Text style={styles.fieldValue}>{formatDate(device.addedAt)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Information</Text>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={device.name}
                onChangeText={(text) => setDevice({ ...device, name: text })}
                placeholder="Enter device name"
              />
            ) : (
              <Text style={styles.fieldValue}>{device.name}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Zone Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={device.zoneName}
                onChangeText={(text) =>
                  setDevice({ ...device, zoneName: text })
                }
                placeholder="Enter zone name"
              />
            ) : (
              <Text style={styles.fieldValue}>{device.zoneName}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Location</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={device.location}
                onChangeText={(text) =>
                  setDevice({ ...device, location: text })
                }
                placeholder="Enter location description"
              />
            ) : (
              <Text style={styles.fieldValue}>{device.location}</Text>
            )}
          </View>
        </View>

        {
          device.active && (
            
            <View style={styles.section}>
            <View style={styles.plantSelectionContainer}>
              <Text style={styles.sectionTitle}>{isEditing ? "Select plant" : "Plant"}</Text>
              {isEditing && (
                <TouchableOpacity onPress={() => setShowModal(true)}>
                  <Ionicons name="create-outline" size={16} />
                </TouchableOpacity>
              )}
            </View>
            <View>
              <View style={styles.plantView}>
                  <Image source={selectedPlant?.imageData ? { uri: `data:${selectedPlant.imageType};base64,${selectedPlant.imageData}` } :
                   require("../../../assets/noImage.jpg")} style={styles.plantImage}/>
                  <Text style={styles.plantName}>{selectedPlant ? selectedPlant.name : "No plant selected"}</Text>
              </View>
            </View>

        </View>
        )
      }
        
        { !device.active &&
          <TouchableOpacity onPress={handleAddDevice} style={styles.addButton}>
          <Text style={[styles.addText, {color: theme.colors.text}]}>Add</Text>
            </TouchableOpacity>
        }

        <SelectPlant modalVisible={showModal} setModalVisible={setShowModal} setSelectedPlant={setSelectedPlant} />

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(4,38,28)",
    paddingTop: 10,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 20,
    fontSize: 18,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: -5,
    fontSize: 16,
    backgroundColor: "#01694D"
  },
  addText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  field: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontWeight: "bold",
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f0fdf4',
  },
  deleteBtn: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    paddingRight: 10,
  },
  plantSelectionContainer:{
    flexDirection: 'row',
    justifyContent: "space-between"
  },
    plantView:{
    backgroundColor: '#f0fdf4',
    marginTop: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center"
  },
  plantName:{
    fontSize: 16,
    marginLeft: 20
  },
  plantImage:{
    width: 50,
    height: 50,
    borderRadius: 8
  }
});

export default DisplayDetail;
