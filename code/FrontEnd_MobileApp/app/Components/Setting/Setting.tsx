import { View, Text, ScrollView, RefreshControl, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { themeAuth } from '../../../Contexts/ThemeContext';
import { userAuth } from '../../../Contexts/UserContext';
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';

const Setting = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {theme} = themeAuth();
  const {user} = userAuth();

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >

        <View style={[styles.profileContainer, {backgroundColor: theme.colors.primary}]}>
          <Image source={user?.imageData ? { uri: `data:${user?.imageData};base64,${user?.imageData}` } : require('../../../assets/profile_picture.webp')} style={styles.profilePicture}/>
          <View>
            <Text style={[styles.profileName, {color: theme.colors.text}]}>{user?.name}</Text>
            <Text style={[styles.profileEmail, {color: theme.colors.text}]}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.secondContainer}>
          <Text style={styles.headings}>Setting</Text>
          <Text style={styles.subHeadings}>Manage your account settings</Text>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.taps} onPress={() => router.push('Components/Profile/Profile')}>
            <View style={styles.tapLeft}>
              <Ionicons name="person-outline" size={24} color="black" />
              <Text style={styles.tapName}>Profile</Text>
            </View>
            <Ionicons name="arrow-forward-outline" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.taps} onPress={() => router.push('Components/ChangePassword/ChangePassword')}>
            <View style={styles.tapLeft}>
              <Ionicons name="lock-closed-outline" size={24} color="black" />
              <Text style={styles.tapName}>Change Password</Text>
            </View>
            <Ionicons name="arrow-forward-outline" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.taps} onPress={() => router.push('Components/Notification/Notification')}>
            <View style={styles.tapLeft}>
              <Ionicons name="notifications-outline" size={24} color="black" />
              <Text style={styles.tapName}>Notifications</Text>
            </View>
            <Ionicons name="arrow-forward-outline" size={24} color="black" />
          </TouchableOpacity>

        </View>

        <View style={styles.secondContainer}>
          <Text style={styles.headings}>More</Text>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.taps} onPress={() => router.push('Components/Help/Help')}>
            <View style={styles.tapLeft}>
              <Ionicons name="help-outline" size={24} color="black" />
              <Text style={styles.tapName}>Help & Support</Text>
            </View>
            <Ionicons name="arrow-forward-outline" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.taps} onPress={() => router.push('Components/About/About')}>
            <View style={styles.tapLeft}>
              <Ionicons name="information-circle-outline" size={24} color="black" />
              <Text style={styles.tapName}>About</Text>
            </View>
            <Ionicons name="arrow-forward-outline" size={24} color="black" />
          </TouchableOpacity>

        </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#012A1C", 
    alignItems: "center",
    paddingTop: 10,
  },
  headings : {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5
  },
  subHeadings:{
    fontSize: 16,
    color: "rgb(70, 70, 70)"
  },
  profileContainer:{
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#01694D",
    width: "90%",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginVertical: 20,
    gap: 20 
  },
  profilePicture:{
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileName:{
    color: "white",
    fontSize: 24
  },
  profileEmail:{
    color: "#ddd",
    fontSize: 18
  },
  secondContainer:{
    marginTop: 10,
    backgroundColor: '#f0fdf4',
    width: "90%",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15
  },
  divider:{
    height: 1,
    backgroundColor: "#bbb",
    marginVertical: 10
  },
  taps:{
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection:"row",
    justifyContent: "space-between",
    marginBottom: 5
  },
  tapName:{
    fontSize: 18,
  },
  tapLeft:{
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  }
})

export default Setting