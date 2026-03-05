// src/navigation/AppNavigator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, BottomTabParamList } from '../types';
import OnboardingScreen from '../screens/OnboardingScreen';
import JobFinderScreen from '../screens/JobFinderScreen';
import SavedJobsScreen from '../screens/SavedJobsScreen';
import AppliedJobsScreen from '../screens/AppliedJobsScreen';
import ApplicationFormScreen from '../screens/ApplicationFormScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import AppliedJobDetailScreen from '../screens/AppliedJobDetailScreen';
import { useTheme } from '../context/ThemeContext';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useAppliedJobs } from '../context/AppliedJobsContext';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Styles must be declared before the components that use them
const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -8,
    top: -6,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  tabIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconInner: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/* ── Badge shown over tab icons ── */
const TabBadge: React.FC<{ count: number; colors: any }> = ({ count, colors }) => {
  if (count === 0) return null;
  return (
    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

/* ── Bottom tab navigator ── */
const BottomTabs: React.FC = () => {
  const { colors } = useTheme();
  const { savedJobs } = useSavedJobs();
  const { appliedJobs } = useAppliedJobs();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
      }}
    >
      {/* Discover */}
      <Tab.Screen
        name="JobFinder"
        component={JobFinderScreen}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIcon, focused && { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="search-outline" size={20} color={color} />
            </View>
          ),
        }}
      />

      {/* Saved */}
      <Tab.Screen
        name="SavedJobs"
        component={SavedJobsScreen}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIcon, focused && { backgroundColor: colors.savedLight }]}>
              <View style={styles.tabIconInner}>
                <Ionicons name="bookmark-outline" size={20} color={color} />
                <TabBadge count={savedJobs.length} colors={colors} />
              </View>
            </View>
          ),
        }}
      />

      {/* Applied */}
      <Tab.Screen
        name="AppliedJobs"
        component={AppliedJobsScreen}
        options={{
          tabBarLabel: 'Applied',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIcon, focused && { backgroundColor: colors.primaryLight }]}>
              <View style={styles.tabIconInner}>
                <Ionicons name="checkmark-done-outline" size={20} color={color} />
                <TabBadge count={appliedJobs.length} colors={colors} />
              </View>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

/* ── Root stack navigator ── */
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        <Stack.Screen
          name="JobDetail"
          component={JobDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="AppliedJobDetail"
          component={AppliedJobDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="ApplicationForm"
          component={ApplicationFormScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;