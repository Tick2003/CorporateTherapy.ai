import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppProvider } from './src/context/AppContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import VentScreen from './src/screens/VentScreen';
import JournalScreen from './src/screens/JournalScreen';
import SkillsScreen from './src/screens/SkillsScreen';
import MoodScreen from './src/screens/MoodScreen';
import AudioScreen from './src/screens/AudioScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Icons
import { 
  Home, 
  MessageSquare, 
  BookOpen, 
  Dumbbell, 
  BarChart2, 
  Headphones, 
  User 
} from 'lucide-react-native';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppProvider>
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ color, size }) => {
                    switch (route.name) {
                      case 'Home':
                        return <Home size={size} color={color} />;
                      case 'Vent':
                        return <MessageSquare size={size} color={color} />;
                      case 'Journal':
                        return <BookOpen size={size} color={color} />;
                      case 'Skills':
                        return <Dumbbell size={size} color={color} />;
                      case 'Mood':
                        return <BarChart2 size={size} color={color} />;
                      case 'Audio':
                        return <Headphones size={size} color={color} />;
                      case 'Profile':
                        return <User size={size} color={color} />;
                      default:
                        return null;
                    }
                  },
                  tabBarActiveTintColor: '#6366f1',
                  tabBarInactiveTintColor: 'gray',
                })}
              >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Vent" component={VentScreen} />
                <Tab.Screen name="Journal" component={JournalScreen} />
                <Tab.Screen name="Skills" component={SkillsScreen} />
                <Tab.Screen name="Mood" component={MoodScreen} />
                <Tab.Screen name="Audio" component={AudioScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
              </Tab.Navigator>
            </NavigationContainer>
          </AppProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;