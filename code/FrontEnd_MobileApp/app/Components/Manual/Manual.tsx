import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../common/Header";
import Footer from "../common/Footer";

const { width } = Dimensions.get("window");

const imageData = [
  {
    id: 1,
    name: "ESP32",
    image: require("../../../assets/ESP32.jpg"),
    description:
      "The ESP32 is a low-cost, low-power system on a chip (SoC) that features Wi-Fi and Bluetooth capabilities. It is widely used in Internet of Things (IoT) projects and can connect sensors to the cloud or mobile apps. The ESP32 allows easy integration of various sensors and is perfect for wireless communication.",
  },
  {
    id: 2,
    name: "DHT22",
    image: require("../../../assets/DHT22.jpg"),
    description:
      "The DHT22 (also known as AM2302) is a digital sensor used to measure temperature and humidity. It provides reliable data with a wide range of measurements (temperature: -40°C to 80°C, humidity: 0-100%). It is ideal for applications requiring environmental monitoring, like weather stations and HVAC systems.",
  },
  {
    id: 3,
    name: "Capasitive moisture sensor",
    image: require("../../../assets/capasitive_moisture_sensor.jpg"),
    description:
      "The VH400 is a soil moisture sensor designed to measure the water content in the soil. It provides real-time data about soil moisture levels and is widely used in agriculture and gardening applications to ensure optimal watering and irrigation systems.",
  },
  {
    id: 4,
    name: "NPK sensor",
    image: require("../../../assets/NPK.jpg"),
    description:
      "The NPK sensor measures the nitrogen (N), phosphorus (P), and potassium (K) content in the soil, which are essential nutrients for plant growth. This sensor helps determine the fertility of the soil and provides crucial data for optimizing fertilizers and improving plant health.",
  },
];

const Manual = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scaleAnim = new Animated.Value(1);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const goToNext = () => {
    if (currentIndex < imageData.length - 1) {
      animatePress();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      animatePress();
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Header viewZone={false} selectedZone={''} setSelectedZone={(zone: string) => {}}/>
      
      <Text style={styles.heading}>{imageData[currentIndex].name}</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Display */}
        <View style={styles.imageContainer}>
          <Image source={imageData[currentIndex].image} style={styles.image} />
        </View>

        <Text style={styles.description}>
          {imageData[currentIndex].description}
        </Text>

        {/* Navigation Controls */}
        <View style={styles.navigationContainer}>
          {/* Left Arrow */}
          <TouchableOpacity
            onPress={goToPrevious}
            style={[
              styles.arrowButton,
              currentIndex === 0 ? styles.disabledButton : styles.activeButton,
            ]}
            disabled={currentIndex === 0}
          >
            <Animated.Text style={styles.arrowText}>{"<"}</Animated.Text>
          </TouchableOpacity>

          {/* Page Number */}
          <View style={styles.pageNumberContainer}>
            <Text style={styles.pageText}>
              {currentIndex + 1} / {imageData.length}
            </Text>
          </View>

          {/* Right Arrow */}
          <TouchableOpacity
            onPress={goToNext}
            style={[
              styles.arrowButton,
              currentIndex === imageData.length - 1
                ? styles.disabledButton
                : styles.activeButton,
            ]}
            disabled={currentIndex === imageData.length - 1}
          >
            <Animated.Text style={styles.arrowText}>{">"}</Animated.Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(4,38,28)",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    marginTop: 30,
  },
  heading:{
    color:"#F6FCDF",
    fontSize: 36,
    textAlign: "center",
    marginTop: "20%",
    fontWeight: "bold",
  },
  imageContainer: {
    width: "85%",
    maxWidth: 420,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: "#f1f5f9",
    overflow: "hidden",

  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  description: {
    fontSize: 20,
    width: "85%",
    textAlign: "justify",
    color: "#F6FCDF",
    marginBottom: 20,
  },
  navigationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: "20%",
  },
  arrowButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5,
    borderWidth: 0.6,
    borderColor: "rgb(1,105,77)",
  },
  activeButton: {
    backgroundColor: "rgb(1,105,77)",
  },
  disabledButton: {
    backgroundColor: "rgba(1, 105, 77, 0.34)",
  },
  pageNumberContainer: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  pageText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  arrowText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
});

export default Manual;
