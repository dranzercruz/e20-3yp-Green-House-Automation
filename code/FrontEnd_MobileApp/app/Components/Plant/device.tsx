// DevicesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { Axios } from "../../AxiosRequestBuilder";
import { useDeviceContext } from "../../../Contexts/DeviceContext";

interface Device {
  id: number;
  name: string;
  type: string;
  status: "active" | "inactive" | "offline";
  lastActive: string;
  imageData?: string;
  imageType?: string;
}

const DevicesScreen = () => {
  const { devices, setDevices } = useDeviceContext();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await Axios.get("/device/getAll");
        setDevices(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDevices();
  }, [refreshing]);

  const renderItem = ({ item }: { item: Device }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "Components/Device/DeviceDetail",
          params: { deviceId: JSON.stringify(item.id) },
        })
      }
    >
      <Image
        source={
          item.imageData
            ? { uri: data:${item.imageType};base64,${item.imageData} }
            : require("../../../assets/noDeviceImage.png")
        }
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.type}>{item.type}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "#4CAF50";
      case "inactive": return "#FFC107";
      case "offline": return "#F44336";
      default: return "#9E9E9E";
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Devices</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#012A1C",
    flex: 1,
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#01694D",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default device;