import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Footer: React.FC = () => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity>
        <Ionicons name="grid" size={28} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("Components/Statics/Statistics")}>
        <Ionicons name="bar-chart" size={28} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("Components/Manual/Manual")}>
        <MaterialCommunityIcons name="account-cog" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#01694D',
    paddingVertical: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Footer;
