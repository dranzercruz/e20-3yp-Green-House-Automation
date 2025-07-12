import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { themeAuth } from '../../Contexts/ThemeContext';

const Footer: React.FC = () => {
  const {theme} = themeAuth();
  const [active, setActive] = useState<string>("Home");

  return (
    <View style={[styles.footer, {backgroundColor: theme.colors.primary}]}>
      <View style={active == "Home" ? styles.footerElementActive : styles.footerElement}>
        <TouchableOpacity onPress={() => {
          router.push("Components/Home/Home");
          setActive("Home");
        }}>
          <Ionicons name="home" size={24} color={theme.colors.text} style={styles.footerIcon}/>
        </TouchableOpacity>
        <Text style={[styles.footerText, {color: theme.colors.text}]}>Home</Text>
      </View>

      <View style={active == "Devices" ? styles.footerElementActive : styles.footerElement}>
        <TouchableOpacity onPress={() => {
          router.push("Components/Device/DisplayList");
          setActive("Devices");
        }}>
          <Ionicons name="radio-sharp" size={24} color={theme.colors.text} style={styles.footerIcon}/>
        </TouchableOpacity>
        <Text style={[styles.footerText, {color: theme.colors.text}]}>Devices</Text>
      </View>

      {/* <View style={active == "Statistics" ? styles.footerElementActive : styles.footerElement}>
        <TouchableOpacity onPress={() => {
          router.push("Components/Statics/Statistics");
          setActive("Statistics");
        }}>
          <Ionicons name="bar-chart" size={24} color={"#fff"} style={styles.footerIcon}/>
        </TouchableOpacity>
        <Text style={styles.footerText}>Statistics</Text>
      </View> */}

      <View style={active == "Plant" ? styles.footerElementActive : styles.footerElement}>
        <TouchableOpacity onPress={() => {
          router.push("Components/Plant/Plant");
          setActive("Plant");
        }}>
          <Ionicons name="planet" size={24} color={theme.colors.text} style={styles.footerIcon}/>
        </TouchableOpacity>
        <Text style={[styles.footerText, {color: theme.colors.text}]}>Plant</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#01694D',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 55,
    elevation: 5,
  },
  footerElement:{
    flexDirection: "column",
    alignItems: "center",
    opacity: 0.7
  },
  footerText:{
    color: "#fff",
  },
  footerIcon:{
    marginTop: -3,
  },
  footerElementActive:{
    flexDirection: "column",
    alignItems: "center",
    opacity: 1
  }
});

export default Footer;
