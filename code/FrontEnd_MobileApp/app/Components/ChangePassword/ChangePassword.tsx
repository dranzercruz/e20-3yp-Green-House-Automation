import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Axios } from '../../AxiosRequestBuilder';
import { themeAuth } from '../../../Contexts/ThemeContext';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { theme } = themeAuth();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    try {
      const response = await Axios.put("auth/user/changePassword", {currentPassword, newPassword});
      if(response.status == 200){
        Alert.alert('Success', 'Your password has been updated.');
      }
    } catch (error: any) {
      if(error.response && error.response.status === 409) {
        Alert.alert('Error', error.response.data || 'Current password is incorrect.');
      }
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.title, {color: theme.colors.text}]}>🔒 Change Password</Text>

      <Text style={[styles.label, {color: theme.colors.text}]}>Current Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Enter current password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <Text style={[styles.label, {color: theme.colors.text}]}>New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Enter new password"
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Text style={[styles.label, {color: theme.colors.text}]}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Confirm new password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={[styles.button, {backgroundColor: theme.colors.primary}]} onPress={handleChangePassword}>
        <Text style={[styles.buttonText, {color: theme.colors.text}]}>Update Password</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#012A1C',
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "black"
  },
  button: {
    backgroundColor: '#01694D', // medium green
    marginTop: 30,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ChangePassword;
