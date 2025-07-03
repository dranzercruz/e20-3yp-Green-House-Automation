// NotificationHandler.tsx

import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

/**
 * Initializes all push notification logic:
 * - Requests permission
 * - Subscribes to topic
 * - Listens for foreground messages
 */
export const initializeNotifications = async (): Promise<() => void> => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('🔒 Notification permission granted.');

    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);

      await messaging().subscribeToTopic('sensor-alerts');
      console.log('Subscribed to topic: sensor-alerts');
    } catch (error) {
      console.error('Subscription error:', error);
    }

    // Foreground listener
    const unsubscribe = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        if (remoteMessage.notification) {
          Alert.alert(
            remoteMessage.notification.title || 'Notification',
            remoteMessage.notification.body || ''
          );
        }
      }
    );

    return unsubscribe;
  } else {
    console.warn('Notification permission denied.');
    return () => {};
  }
};
