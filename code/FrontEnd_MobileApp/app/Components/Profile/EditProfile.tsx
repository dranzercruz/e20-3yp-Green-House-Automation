import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import { userAuth } from "../../../Contexts/UserContext";
import { Axios } from "../../AxiosRequestBuilder";
import { Ionicons } from '@expo/vector-icons';
import { themeAuth } from "../../../Contexts/ThemeContext";
import * as ImagePicker from 'expo-image-picker';
import { get } from "../../../Storage/secureStorage";

interface USER {
  name: string;
  email: string;
  phoneNumber: number;
  imageData: string;
  imageType: string;
  imageName: string;
  authMethod: string;
}

const Profile: React.FC = () => {
  const {user, setUser} = userAuth();
  const {theme} = themeAuth();  
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [image, setImage] = useState<FileToUpload>();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handlePickImage = async () => {
    // Ask for media library permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access media library is required!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const pickedImage = result.assets[0];
      setImageUri(pickedImage.uri);
      setImage({
        uri: pickedImage.uri,
        name: pickedImage.fileName || 'photo.jpg',
        type: pickedImage.type || 'image/jpeg',
      });

      // You can create a "file-like" object to upload
      const fileToUpload = {
        uri: pickedImage.uri,
        name: pickedImage.fileName || 'photo.jpg',
        type: pickedImage.type || 'image/jpeg',
      };

      console.log('Selected image file:', fileToUpload);

      // You can now upload it using fetch or Axios
    }
  };

  useEffect(() => {
    if (user) {
      const imageUri = `data:${user.imageType};base64,${user.imageData}`;
      setImageUri(imageUri);
      }
    }, [user, refreshing]);

  const handleInput = (text: string | number, field: keyof USER) => {
    setUser((prevUser: USER) => ({
      ...prevUser,
      [field]: text,
    }));
  };
  
  interface FileToUpload {
    uri: string;
    name: string;
    type: string;
  }

  const handleUpdate = async () => {
    console.log(image);
    const formData = new FormData();
    
    if (image?.uri) {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const base64Image = await blobToBase64(blob);
      formData.append("imageData", base64Image);
      formData.append("imageType", image.type);
      formData.append("imageName", image.name);
      console.log("Image Data:", base64Image);
      
      function blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
      
      formData.append("file", blob, image.name);
    }
    if (user) {
      formData.append("name", user.name);
      formData.append("phoneNumber", user.phoneNumber.toString());
    }
    
    
    const token = get("token");
    try {
      const response = await Axios.put("/auth/user/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });
      setUser(response.data);
      router.push("Components/Profile/Profile");
    } catch (error) {
      Alert.alert(String(error));
      console.log(error);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
    >
    
      <View style={styles.profileContainer}>
        <Text style={[styles.headings, {color: theme.colors.text}]}> Edit Profile </Text>
        <View style={styles.profileWork}>
          <View style={[styles.inner, {backgroundColor: theme.colors.primary}]}>
            <Image
              source={
                user?.imageData
                ? { uri: imageUri }
                : require("../../../assets/profile_picture.webp")
              }
              style={[styles.profileImage, {borderColor: theme.colors.text}]}
              />
          </View>
          <Ionicons name="camera" size={30} style={{marginTop: 10}} color={theme.colors.text} onPress={handlePickImage}/>
        </View>

      </View>

      <View style={[styles.detailsContainer, {backgroundColor: theme.colors.primary}]}>
        <View style={styles.detailsContent}>
          <View style={styles.detailsRow}>
            <Text style={[styles.label, {color: theme.colors.text}]}>Name</Text>
            <Text style={[styles.separator, {color: theme.colors.text}]}>:</Text>
            <TextInput
              style={[styles.value, {color: theme.colors.text, borderBottomColor: theme.colors.text}]}
              value={user?.name || ""}
              onChangeText={(text) => handleInput(text, "name")}
              placeholderTextColor="white"
              />
          </View>

          <View style={styles.detailsRow}>
            <Text style={[styles.label, {color: theme.colors.text}]}>Email</Text>
            <Text style={[styles.separator, {color: theme.colors.text}]}>:</Text>
            <Text style={[styles.value, {color: theme.colors.text, borderBottomColor: theme.colors.text}]}>{user?.email}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={[styles.label, {color: theme.colors.text}]}>Contact-No</Text>
            <Text style={[styles.separator, {color: theme.colors.text}]}>:</Text>
            <TextInput
              style={[styles.value, {color: theme.colors.text, borderBottomColor: theme.colors.text}]}
              value={user?.phoneNumber?.toString() || ""}
              onChangeText={(text) => handleInput(text.replace(/[^0-9]/g, ""), "phoneNumber")}
              placeholderTextColor="white"
              />
          </View>
        </View>

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => handleUpdate()}
          >
          <Text style={styles.editProfileText}>Update</Text>
        </TouchableOpacity>
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
  headings: {
    marginTop: 10,
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
    textAlign: "center",
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
    fontSize: 15,
    fontWeight: "light",
    color: "#FFFFFF",
    flex: 1,
    width: "70%",
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
});

export default Profile;
