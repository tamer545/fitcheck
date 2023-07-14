import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import firebase from "firebase/compat";

export default function App() {
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [trainingsplan, setTrainingsplan] = useState<string>()
    const [possibleTrainingsplans, setPossibleTrainingsplans] = useState<string[]>()

    useEffect(() => {
        if (trainingsplan){
            firebase.app().database()
                .ref(`users/${firebase.app().auth().currentUser?.uid}/details`)
                .set({
                    firstname: firstname,
                    lastname: lastname,
                    trainingsplan: trainingsplan
                })
        }
    }, [trainingsplan]);

    useEffect(() => {
        firebase.app().database()
            .ref(`users/${firebase.app().auth().currentUser?.uid}/details`)
            .get().then(snapshot => {
            setFirstname(snapshot.val().firstname)
            setLastname(snapshot.val().lastname)
            setTrainingsplan(snapshot.val().trainingsplan)
        })

        firebase.app().database()
            .ref(`trainings/`)
            .get().then(snapshot => {
            setPossibleTrainingsplans(Object.keys(snapshot.val()))
        })
    }, [])

    return (
        <View>
            <Text style={styles.paragraph}>{firstname} {lastname}</Text>
            <Button title={"Ausloggen"} onPress={() => {
                firebase.app().auth().signOut()
            }}/>

            <Text style={styles.paragraph}>Trainingsplan ändern:</Text>
            <Text style={styles.paragraph}>{trainingsplan}</Text>
            <Button title={"Trainingsplan ändern"} onPress={() => {
                console.log("press")
                let newTrainingsplan = ""
                if (trainingsplan === "abnehmen") {
                    newTrainingsplan = "muskelAufbau";
                }else {
                    newTrainingsplan = "abnehmen";
                }

                setTrainingsplan(newTrainingsplan)
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
