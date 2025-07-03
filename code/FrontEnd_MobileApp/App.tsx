import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Page from './app/index';
import login from './app/Components/Authentication/login';
import register from './app/Components/Authentication/register';

import { initializeNotifications } from './app/Components/Notification Handler/NotificationHandler';

const Stack = createStackNavigator();

export default function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    let unsubscribe: () => void;

    (async () => {
      unsubscribe = await initializeNotifications();
    })();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLogin ? "page" : "login"}>
        <Stack.Screen name="login" component={login} />
        <Stack.Screen name="page" component={Page} />
        <Stack.Screen name="register" component={register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
