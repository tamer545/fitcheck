import { Redirect } from "expo-router";
import React, {useState} from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";
import {Button, SafeAreaView, StyleSheet, TextInput} from "react-native";
import firebase from "firebase/compat";
import User = firebase.User;
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [register, setRegister] = useState(false);
    const auth = getAuth();

    function loginWithEmailAndPassword() {
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                setLoggedIn(true)
                await AsyncStorage.setItem('uid', user.uid);
                await AsyncStorage.setItem('user', user.email || user.displayName || user.uid);
                console.log(user)
            })
            .catch((error) => {
                setLoggedIn(false)
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
            });
    }

    function registerWithEmailAndPassword(){
        if (password == passwordConfirm){
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log(user);
                    loginWithEmailAndPassword();
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage)

                });
        }
    }

    if (loggedIn){
        return <Redirect href="/home" />;
    }

    if (register){
        return (
            <SafeAreaView style={styles.container}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="E-Mail"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    placeholder="Password"
                    keyboardType="visible-password"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setPasswordConfirm(text)}
                    value={passwordConfirm}
                    placeholder="confirm Password"
                    keyboardType="visible-password"
                />
                <Button title={'Registrieren'} onPress={() => registerWithEmailAndPassword()}/>
                <Button title={'Ich habe schon einen Account'} onPress={() => {
                    setEmail("");
                    setPassword("");
                    setRegister(false)
                }}/>
            </SafeAreaView>
        )
    }

    return (
            <SafeAreaView style={styles.container}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="E-Mail"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    placeholder="Password"
                    keyboardType="visible-password"
                />
                <Button title={'Login'} onPress={() => loginWithEmailAndPassword()}/>
                <Button title={'Registrieren'} onPress={() => {
                    setEmail("");
                    setPassword("");
                    setPasswordConfirm("");
                    setRegister(true)
                }}/>
            </SafeAreaView>
        )
};
export default Index;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    paragraph: {
        fontSize: 12,
        textAlign: 'left',
        marginTop: 5
    },
    heading: {
        marginTop: 20
    },
    spinnerTextStyle: {
        color: '#FFF',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 250
    },
});
