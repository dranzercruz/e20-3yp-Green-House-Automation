import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { themeAuth } from '../../../Contexts/ThemeContext';

const DeviceManagement = () => {
    const { theme } = themeAuth();

    return (
        <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
            <Text style={[styles.heading, {color: theme.colors.text}]}>Device Management</Text>

            <View style={[styles.contentContainer, {backgroundColor: theme.colors.cardBackground}]}>
                <Text style={[styles.subtitle, {color: theme.colors.text}]}>Managing Devices</Text>
                <Text style={{color: theme.colors.text, fontSize: 16}}>
                    To manage your devices, follow these steps:
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                    1. Open the app and navigate to the devices section.
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                    2. You will see a list of all registered devices.
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                    3. Click on a device to view its details and status.
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                    4. You can edit the device name, zone name, and location.
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                    5. To remove a device, click on the delete button next to the device name.
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                    Note: Ensure that you have the necessary permissions to manage devices.
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    heading: {
        marginVertical: 10,
        fontSize: 24,
        fontWeight: "bold",
        paddingLeft: 10,
    },
    contentContainer: {
        // flexGrow: 1,
        marginTop: 20,
        padding: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold', 
        marginBottom: 10
    }
})

export default DeviceManagement