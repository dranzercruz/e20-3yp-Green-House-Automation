import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { themeAuth } from '../../../Contexts/ThemeContext';

const AboutScreen = () => {
  const { theme } = themeAuth();
  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Image
        source={require('../../../assets/greenHouse.jpg')} // replace with your actual image
        style={styles.image}
      />

      <Text style={[styles.title, {color: theme.colors.text}]}>Green-Tech</Text>
      <Text style={[styles.subtitle, {color: theme.colors.text}]}>Smart Greenhouse Automation</Text>

      <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>🌱 About the Project</Text>
      <Text style={[styles.text, {color: theme.colors.text}]}>
        Green-Tech is a smart greenhouse automation system designed to monitor and control
        environmental parameters such as temperature, humidity, soil moisture, and light.
        It ensures optimal plant growth with minimal manual intervention by leveraging
        IoT-based sensors and cloud technology.
      </Text>

      <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>⚙️ Key Features</Text>
      <Text style={[styles.text, {color: theme.colors.text}]}>
        • Real-time monitoring of temperature, humidity, soil moisture{'\n'}
        • Automated irrigation system based on sensor data{'\n'}
        • Mobile app control and live data dashboard{'\n'}
        • Alerts and notifications for abnormal conditions{'\n'}
        • Cloud-based storage and analytics
      </Text>

      <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>🎯 Mission</Text>
      <Text style={[styles.text, {color: theme.colors.text}]}>
        Our mission is to promote sustainable agriculture by providing farmers and greenhouse
        owners with an intelligent, affordable, and efficient solution for growing crops using smart technology.
      </Text>

      <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>📡 Technologies Used</Text>
      <Text style={[styles.text, {color: theme.colors.text}]}>
        • ESP32 Microcontroller{'\n'}
        • DHT22, Capacitive Moisture Sensor, LDR{'\n'}
        • AWS IoT Core, MQTT Protocol{'\n'}
        • React Native (Mobile App), Spring Boot (Backend){'\n'}
        • Firebase / AWS DynamoDB (Cloud Storage)
      </Text>

      <Text style={[styles.footer, {color: theme.colors.text}]}>© 2025 Green-Tech Project. All rights reserved.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#012A1C',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ddd',
    marginTop: 20,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
  },
  footer: {
    marginTop: 30,
    fontSize: 14,
    textAlign: 'center',
    color: '#ccc',
  },
});

export default AboutScreen;
