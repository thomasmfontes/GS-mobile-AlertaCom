import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppTabParamList, AppStackParamList } from '../types/navigation';
import { HomeScreen } from '../screens/app/HomeScreen';
import { IncidentsListScreen } from '../screens/app/IncidentsListScreen';
import { NewIncidentScreen } from '../screens/app/NewIncidentScreen';
import { MyIncidentsScreen } from '../screens/app/MyIncidentsScreen';
import { AboutScreen } from '../screens/app/AboutScreen';
import { IncidentDetailScreen } from '../screens/app/IncidentDetailScreen';
import { Colors } from '../theme/Colors';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: keyof AppTabParamList;
  title: string;
  icon: IoniconsName;
  iconOutline: IoniconsName;
  component: React.ComponentType<any>;
}

const TABS: TabConfig[] = [
  { name: 'HomeTab', title: 'Início', icon: 'home', iconOutline: 'home-outline', component: HomeScreen },
  { name: 'IncidentsListTab', title: 'Ocorrências', icon: 'list', iconOutline: 'list-outline', component: IncidentsListScreen },
  { name: 'NewIncidentTab', title: 'Reportar', icon: 'add-circle', iconOutline: 'add-circle-outline', component: NewIncidentScreen },
  { name: 'MyIncidentsTab', title: 'Chamados', icon: 'folder', iconOutline: 'folder-outline', component: MyIncidentsScreen },
  { name: 'AboutTab', title: 'Sobre', icon: 'information-circle', iconOutline: 'information-circle-outline', component: AboutScreen },
];

function TabIcon({
  iconName,
  color,
  focused,
  activeBgColor,
}: {
  iconName: IoniconsName;
  color: string;
  focused: boolean;
  activeBgColor: string;
}) {
  return (
    <View style={[styles.iconWrapper, focused && { backgroundColor: activeBgColor }]}>
      <Ionicons name={iconName} size={20} color={color} />
    </View>
  );
}

const Tab = createBottomTabNavigator<AppTabParamList>();
const Stack = createStackNavigator<AppStackParamList>();

const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'android' ? 12 : 8);

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      detachInactiveScreens={false}
      sceneContainerStyle={{ backgroundColor: Colors.background }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.defesaOrange,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: Colors.tabBarBg,
            height: 56 + bottomInset,
            paddingBottom: bottomInset,
            borderTopColor: Colors.border,
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {TABS.map(({ name, title, icon, iconOutline, component }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            title,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName={focused ? icon : iconOutline}
                color={color}
                focused={focused}
                activeBgColor={Colors.defesaOrangeLight}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Stack.Navigator
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
        cardStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="IncidentDetail" component={IncidentDetailScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    paddingTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarItem: {
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.1,
    marginTop: -2,
  },
  iconWrapper: {
    width: 36,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
});

export default AppRoutes;
