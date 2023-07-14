import {Redirect} from "expo-router";
import React, {useState} from "react";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {Button, SafeAreaView, StyleSheet, Text, TextInput} from "react-native";
import firebase from "firebase/compat";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [register, setRegister] = useState(false);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [errorMessage, setErrorMessage] = useState("")
    const auth = getAuth();

    function loginWithEmailAndPassword() {
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                setLoggedIn(true)
            })
            .catch((error) => {
                setLoggedIn(false)
                const errorCode = error.code;
                const errorMessage = error.message;
                setErrorMessage(errorMessage)
            });
    }

    function registerWithEmailAndPassword() {
        if (password == passwordConfirm) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log(user);
                    loginWithEmailAndPassword();
                    firebase.app().database()
                        .ref(`users/${user.uid}/details`)
                        .set({firstname: firstname, lastname: lastname, trainingsplan: "abnehmen"})
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setErrorMessage(errorMessage)
                });
        }
    }

    if (loggedIn) {
        console.log("aa")
        return <Redirect href="../home"/>;
    }

    if (register) {
        return (
            <SafeAreaView style={styles.container}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setFirstname(text)}
                    value={firstname}
                    placeholder="Vorname"
                    keyboardType="default"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setLastname(text)}
                    value={lastname}
                    placeholder="Nachname"
                    keyboardType="default"
                />
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
                    secureTextEntry
                    keyboardType="visible-password"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setPasswordConfirm(text)}
                    value={passwordConfirm}
                    secureTextEntry
                    placeholder="confirm Password"
                    keyboardType="visible-password"
                />
                <Text style={styles.error}>{errorMessage}</Text>
                <Button title={'Registrieren'} onPress={() => registerWithEmailAndPassword()}/>
                <Button title={'Ich habe schon einen Account'} onPress={() => {
                    setEmail("");
                    setPassword("");
                    setRegister(false)
                    setErrorMessage("")
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
                secureTextEntry
                keyboardType="visible-password"
            />
            <Text style={styles.error}>{errorMessage}</Text>
            <Button title={'Login'} onPress={() => loginWithEmailAndPassword()}/>
            <Button title={'Registrieren'} onPress={() => {
                setEmail("");
                setPassword("");
                setPasswordConfirm("");
                setRegister(true)
                setErrorMessage("")
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
    error: {
        fontSize: 12,
        textAlign: 'left',
        marginTop: 5,
        color: 'red',
    }
});
