import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
// import { initializeNotifications } from './app/Components/Notifiation Handler/NotificationHandler'; // Adjust path as needed

export default function App() {
  // useEffect(() => {
  //   let unsubscribe: () => void;

  //   (async () => {
  //     unsubscribe = await initializeNotifications();
  //   })();

  //   return () => {
  //     if (unsubscribe) {
  //       unsubscribe();
  //     }
  //   };
  // }, []);

  return (
    <View style={styles.container}>
      <Text>🚀 Notifications initialized with Firebase!</Text>
      <StatusBar style="inverted" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
