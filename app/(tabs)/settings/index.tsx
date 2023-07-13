import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import firebase from "firebase/compat";
import {Link, Redirect} from "expo-router";


export default function App() {
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")

    firebase.app().database()
        .ref(`users/${firebase.app().auth().currentUser?.uid}/details`)
        .get().then(snapshot => {
        setFirstname(snapshot.val().firstname)
        setLastname(snapshot.val().lastname)
    })

    return (
        <View>
            <Text style={styles.paragraph}>{firstname} {lastname}</Text>
            <Button title={"Ausloggen"} onPress={() => {
                firebase.app().auth().signOut()
            }}/>
        </View>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    paragraph: {
        fontSize: 20,
        marginTop: 5,
        textAlign: "center"
    },
    heading: {
        marginTop: 20
    },
    spinnerTextStyle: {
        color: '#FFF',
    },
});
