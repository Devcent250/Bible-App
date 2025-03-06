import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './navigation/tabs';
import Books from "./screens/Books";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Main Tab Navigation */}
        <Stack.Screen name="Tabs" component={Tabs} />

        {/* Books Screen */}
        <Stack.Screen name="Books" component={Books} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
