import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from '../component/screens/HomeScreen';
import DetailsScreen from '../component/screens/DetailsScreen';
import HistoryScreen from '../component/screens/HistoryScreen';

export default function NavContainer() {

//Screen names
const homeName = "Home";
const detailsName = "Details";
const historyName = "History";

const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route ,  }) => ({
          tabBarActiveTintColor: 'dodgerblue',
          tabBarInactiveTintColor: 'grey',
          tabBarStyle: { paddingBottom: 5, padding: 5, height: 60 },
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';

            } else if (rn === detailsName) {
              iconName = focused ? 'list' : 'list-outline';

            } else if (rn === historyName) {
              iconName = focused ? 'server' : 'server-outline';
            }
            //return any component
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}>

        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen name={detailsName} component={DetailsScreen} />
        <Tab.Screen name={historyName} component={HistoryScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}