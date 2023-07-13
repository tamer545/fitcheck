import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function HomeLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "lightblue",
                },
                headerTintColor: "darkblue",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                headerTitle: "Fitcheck      " + await AsyncStorage.getItem('user')
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Welcome",
                }}
            />
        </Stack>
    );
}