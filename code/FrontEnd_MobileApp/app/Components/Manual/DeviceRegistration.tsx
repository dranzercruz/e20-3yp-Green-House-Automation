import { View, Text ,StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { themeAuth } from '../../../Contexts/ThemeContext'

const DeviceRegistration = () => {
    const { theme } = themeAuth();

    return (
        <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
            <Text style={[styles.heading, {color: theme.colors.text}]}>Device Registration</Text>

            <ScrollView style={[styles.contentContainer, {backgroundColor: theme.colors.cardBackground}]}>
                <Text style={[styles.subtitle, {color: theme.colors.text}]}>Registering a Device</Text>
                <Text style={{color: theme.colors.text, fontSize: 16}}>
                    To register a new device, follow these steps:
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                    1. Ensure the device is powered on correctly with all components fixed.
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                    2. After powering on, device will automatically create a Wi-Fi hotspot. Connect your phone to this hotspot (ESP32-Setup).
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                    3. After connecting, go to browser and enter the IP address: 
                        <Text style={{fontWeight: 'bold'}}> http://192.168.4.1/</Text>
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                    4. Enter the Wi-Fi credentials and provide your registered email address.
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                    5. Device will restart and connect to the Wi-Fi network.
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                    6. After a few seconds, the device will be registered and you can manage it through the app.
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                    7. Now go to the app and refresh the device list to see your newly registered device in the non-active tap.
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                    8. click on the device to enter the device name, zone name, location then save it and add the device to the active devices. 
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                    9. Go to the home screen and you will see Zone name. Naviage to the zone to see the device.
                </Text>
                <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10, marginBottom: 20}}>
                    Note: Ensure that the device is within range of your Wi-Fi network for successful registration.
                </Text>
            </ScrollView>
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
        flexGrow: 1,
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

export default DeviceRegistration