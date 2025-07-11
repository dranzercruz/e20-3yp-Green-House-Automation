// // AllPlantsScreen.js
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   RefreshControl,
// } from "react-native";
// import { router } from "expo-router";
// import { Axios } from "../../AxiosRequestBuilder";
// import { usePlantContext } from "../../../Contexts/PlantContext";

// interface Plant {
//   id: number;
//   name: string;
//   description: string;
//   temperatureLow: number;
//   temperatureHigh: number;
//   humidityLow: number;
//   humidityHigh: number;
//   moistureLow: number;
//   moistureHigh: number;
//   nitrogen: number;
//   phosphorus: number;
//   potassium: number;
//   imageData: string;
//   imageType: string;
//   imageName: string;
// }

// const Plant = () => {
//   const {plants, setPlants} = usePlantContext();
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     const fetchPlants = async () => {
//       try {
//         const response = await Axios.get("/plant/getAll");
//         setPlants(response.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchPlants();
//   }, [refreshing]);

//   const renderItem = ({ item }: { item: Plant }) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() =>
//         router.push({
//           pathname: "Components/Plant/PlantDetail",
//           params: { plantId: JSON.stringify(item.id) },
//         })
//       }
//     >
//       <Image
//         source={
//           item.imageData
//             ? { uri: `data:${item.imageType};base64,${item.imageData}` }
//             : require("../../../assets/noImage.jpg")
//         }
//         style={styles.image}
//       />
//       <Text style={styles.name}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   const onRefresh = () => {
//     setRefreshing(true);
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 1500);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Available Plants</Text>
//       <FlatList
//         data={plants}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 20 }}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#012A1C",
//     flex: 1,
//     padding: 16,
//     paddingTop: 20,
//   },
//   title: {
//     fontSize: 24,
//     color: "#fff",
//     fontWeight: "bold",
//     marginBottom: 40,
//     textAlign: "center",
//   },
//   card: {
//     backgroundColor: "#01694D",
//     borderRadius: 12,
//     marginBottom: 16,
//     padding: 10,
//     alignItems: "center",
//     flexDirection: "row",
//     gap: 30,
//   },
//   image: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//   },
//   name: {
//     fontSize: 18,
//     color: "#fff",
//     fontWeight: "600",
//   },
// });

// export default Plant;
