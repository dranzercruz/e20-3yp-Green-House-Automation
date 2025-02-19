import React, { useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  ScrollView
} from "react-native";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const Home = () => {

  const zones = ["ZONE 1", "ZONE 2", "ZONE 3", "ZONE 4", "ZONE 5", "ZONE 6"];

  return (
    <>
      <Header viewZone={false} selectedZone={''} setSelectedZone={() => {}}/>

      <View style={styles.container}>
        <Text style={styles.heading}>Green Tech</Text>

        <Image source={require("../../../assets/download.jpeg")} style={styles.image} />

        <ScrollView style={styles.optionsContainer}>
            {zones.map((option, index) => (
              <TouchableOpacity key={index} style={styles.optionButton} onPress={() => router.push("/Components/zone/Zone")}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(4,38,28)",
    alignItems: "center",
  },
  heading:{
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: "20%",
  },
  image: {
    width: width * 0.9,
    height: height * 0.25,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  optionsContainer: {
    width: "90%",
    backgroundColor: "#01694D",
    padding: 15,
    borderRadius: 10,
    marginBottom: "20%",
  },
  optionButton: {
    width: "100%",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#04261C",
    borderRadius: 10,
    alignItems: "center",
  },
  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;
