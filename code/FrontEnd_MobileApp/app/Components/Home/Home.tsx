import React, { useContext, useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  FlatList,
  RefreshControl,
  ScrollView
} from "react-native";
import { router } from "expo-router";
import { Axios } from "../../AxiosRequestBuilder";
import { themeAuth } from "../../../Contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

type Device = {
  id: number;
  mac: string;
  name: string;
  zoneName: string;
  location: string;
  addedAt: string;
  userId: number;
};

const Home = () => {
  
  const [zones, setZones] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = themeAuth();


  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  useEffect(()=>{
    const fetchDevices = async () => {
      try {
        const response = await Axios.get('/device/activeByZones');
        setZones(response.data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    }
    fetchDevices();
  },[refreshing])

  const directToDetail = (item: Device[]) => {
    router.push({ pathname: '/Components/zone/Zone', params: { zone: JSON.stringify(item) } })
  };
  
  return (
      <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        <Text style={[styles.heading, {color: theme.colors.text}]}>Home</Text>

        <Image source={require("../../../assets/greenHouse.jpg")} style={styles.image} />

        <View style={styles.optionsContainer}>
          {Object.keys(zones).map((zoneName, index) => (
            <TouchableOpacity key={index} onPress={() => directToDetail(zones[zoneName])}>
              <View style={[styles.card, {backgroundColor: theme.colors.cardBackground}]}>
                <Text style={[styles.deviceName, {color: theme.colors.text}]}>{zoneName}</Text>
                <Text style={[styles.deviceDetails, {color: theme.colors.text}]}>Devices: {zones[zoneName].length}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
  },
  heading:{
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  image: {
    width: width * 0.9,
    height: height * 0.25,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 15,
  },
  optionsContainer: {
    flex: 1,
    width: "90%",
    paddingBottom: 20,
  },
   card: {
    backgroundColor: '#01694D',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  deviceName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#fff',
  },
  deviceDetails: {
    fontSize: 14,
    color: '#eee',
    marginBottom: 4,
  },
  timeContainer: {
    width: '100%',
  }, 
  time: {
    fontSize: 12,
    color: 'rgb(200, 200, 200)',
    textAlign: 'right',
  },
});

export default Home;
