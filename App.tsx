import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Button } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    // ขออนุญาต Notification สำหรับ iOS
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };

    requestUserPermission();

    // รับ Token ของอุปกรณ์และแสดงผล
    const getToken = async () => {
      const token = await messaging().getToken();
      setFcmToken(token); // แสดงผล Token บนหน้าจอ
      console.log('Device FCM Token:', token);
    };

    getToken();

    // ตั้งค่า Notification เมื่อแอปอยู่ใน Foreground
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      Alert.alert('New FCM Message!', JSON.stringify(remoteMessage.notification));
    });

    // ตั้งค่า Notification เมื่อแอปอยู่ใน Background หรือปิดอยู่
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Cleanup subscription
    return () => {
      unsubscribeForeground();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>FCM Token:</Text>
      <Text selectable style={{ fontSize: 12, marginBottom: 20 }}>{fcmToken}</Text>
      <Button
        title="Copy FCM Token"
        onPress={() => {
          Alert.alert('FCM Token', fcmToken);
        }}
      />
    </View>
  );
};

export default App;
