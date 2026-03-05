import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { SavedJobsProvider } from './src/context/SavedJobsContext';
import { AppliedJobsProvider } from './src/context/AppliedJobsContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <SavedJobsProvider>
            <AppliedJobsProvider>
              <AppNavigator />
              <StatusBar style="auto" />
            </AppliedJobsProvider>
          </SavedJobsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
