import { Stack } from "expo-router";

export default function HomeLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "gray",
                },
                headerTintColor: "orange",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                headerTitle: "Fitcheck"
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