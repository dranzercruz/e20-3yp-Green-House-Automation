import { router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { userAuth } from "../../../Contexts/UserContext";
import { useState } from 'react';
import { themeAuth } from '../../../Contexts/ThemeContext';


// Main Profile Component
const Profile: React.FC = () => {
  const {theme} = themeAuth();
  const {user} = userAuth();
  const [refreshing, setRefreshing] = useState(false);
  
    const onRefresh = () => {
      setRefreshing(true);
  
      setTimeout(() => {
        setRefreshing(false);
      }, 1500);
    };
  
  const imageUri = `data:${user?.imageType};base64,${(user?.imageData)}`;

  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >

      <View style={styles.profileContainer}>
        <Text style={[styles.headings, {color: theme.colors.text}]}> Profile </Text>
          <View style={styles.profileWork}>
            <View style={[styles.inner, {backgroundColor: theme.colors.primary}]}>
              <Image
                source={user?.imageData ? { uri: imageUri } : require("../../../assets/profile_picture.webp")}
              style={[styles.profileImage, {borderColor: theme.colors.text}]}
                />
            </View>
          </View>
        
          <TouchableOpacity style={[styles.editProfileButton, {backgroundColor: theme.colors.primary}]} onPress={() => router.push('Components/Profile/EditProfile')}>
            <Text style={[styles.editProfileText, {color: theme.colors.text}]}>Edit Profile</Text>
          </TouchableOpacity>
      </View>

      <View style={[styles.detailsContainer, {backgroundColor: theme.colors.primary}]}>
        <View style={styles.detailsContent}>
          <View style={styles.detailsRow}>
            <Text style={[styles.label, {color: theme.colors.text}]}>Name</Text>
            <Text style={[styles.separator, {color: theme.colors.text}]}>:</Text>
            <Text style={[styles.value, {color: theme.colors.text}]}>{user?.name }</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={[styles.label, {color: theme.colors.text}]}>Email</Text>
            <Text style={[styles.separator, {color: theme.colors.text}]}>:</Text>
            <Text style={[styles.value, {color: theme.colors.text}]}>{ user?.email}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={[styles.label, {color: theme.colors.text}]}>Contact No</Text>
            <Text style={[styles.separator, {color: theme.colors.text}]}>:</Text>
            <Text style={[styles.value, {color: theme.colors.text}]}>{user?.phoneNumber }</Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
};

// Define styles using StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#012A1C", 
    alignItems: "center",
    paddingTop: 10,
  },
  headings : {
    marginBottom: 10,
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    width: "100%",
    paddingBottom: 50,
  },
  profileWork: {
    width: "100%",
    height: 200,
    display: "flex",
    alignItems: "center", 
    justifyContent: "center", 
  },
  inner: {
    backgroundColor: "#01694D",
    width: "100%",
    height: "60%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  editProfileButton: {
    marginTop: 15,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#012A1C",
  },
  detailsContainer: {
    width: "90%",
    backgroundColor: "#01694D", 
    padding: 20,
    marginTop: 20, 
    borderRadius: 20,
  },
  detailsContent: {
    flexDirection: "column",
    paddingVertical: 10,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 15, 
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    width: "30%", 
  },
  separator: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginHorizontal: 12, 
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1, 
    width: "70%",
  },
});

export default Profile;
