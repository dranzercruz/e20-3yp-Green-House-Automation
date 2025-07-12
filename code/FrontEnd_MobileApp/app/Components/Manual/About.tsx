import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { themeAuth } from '../../../Contexts/ThemeContext'

const About = () => {
    const { theme } = themeAuth();
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <Text style={[styles.heading, {color: theme.colors.text}]}>About</Text>

        <View style={[styles.contentContainer, {backgroundColor: theme.colors.cardBackground}]}>
            <Text style={[styles.subtitle, {color: theme.colors.text}]}>Green-Tech App</Text>
            <Text style={{color: theme.colors.text, fontSize: 16}}>
                Green-Tech app is designed to help you manage your green house devices and provide information about the system.
                It includes features for device registration, management, and general information. You can easily see the status 
                of your devices, register new devices, and manage existing ones.
            </Text>
            <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                For more information, please refer to the documentation or contact support.
            </Text>
            <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                Version: 1.0.0
            </Text>
            <Text style={{color: theme.colors.text, fontSize: 16, marginTop: 10}}>
                Last Updated: May 2025
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
        marginTop: 20,
        padding: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold', 
        marginBottom: 10
    }
})

export default About