import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from "expo-router";

export default function RootLayout(){
    return (
        <Tabs screenOptions={{headerStyle: { backgroundColor: '#f5f5f5'},
        headerShadowVisible: false,
        tabBarStyle: {
            backgroundColor: '#f5f5f5',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: '#666666',
        }}>
            <Tabs.Screen name="index" options={{title: "Today's Habit",
                tabBarIcon: ({size, color}) => (
                    <MaterialCommunityIcons name="calendar-today" color={color} size={size}/>
                )
            }}/>
                
           <Tabs.Screen name="streaks" options={{title: "Streaks",
                tabBarIcon: ({size, color}) => (
                    <MaterialCommunityIcons name="chart-line" color={color} size={size}/>
                )
            }}/>
           <Tabs.Screen name="add-habit" options={{title: "Add Habit",
                tabBarIcon: ({size, color}) => (
                    <MaterialCommunityIcons name="plus-circle" color={color} size={size}/>
                )
            }}/>
        </Tabs>
    );
}