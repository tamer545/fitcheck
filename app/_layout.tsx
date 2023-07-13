import {Stack} from "expo-router";
import firebase from "firebase/compat";
import {useState} from "react";


export default function HomeLayout() {

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "gray",
                },
                headerTintColor: "lightblue",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                headerTitle: "Fitcheck  "
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