/* eslint-disable require-jsdoc */
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function ModalScreen() {
  return (
    <WebView
    automaticallyAdjustContentInsets={true}
      source={{
        uri: "https://linklab.domain.com/loginPage/?client=Linklab#/",
      }}
      userAgent="LinkLab Mobile"
      allowsBackForwardNavigationGestures
      scrollEnabled

    />

    // <View style={styles.container}>
    //   <Text style={styles.title}>Modal</Text>
    //   <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    //   <EditScreenInfo path="/screens/ModalScreen.tsx" />

    //   {/* Use a light status bar on iOS to account for the black space above the modal */}
    //   <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
