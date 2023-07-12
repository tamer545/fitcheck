import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function AppLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: () => <Text>🏠</Text>,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "Verlauf",
                    tabBarIcon: () => <Text>🕝</Text>,
                }}
            />
            <Tabs.Screen
                name="weather"
                options={{
                    title: "Wetter",
                    tabBarIcon: () => <Text>⛅</Text>,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Einstellungen",
                    tabBarIcon: () => <Text>⚙️</Text>,
                }}
            />
        </Tabs>
    );
}