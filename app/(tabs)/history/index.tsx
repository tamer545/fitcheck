import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import firebase from "firebase/compat";


export default function App() {
    const [runs, setRuns] = useState([])


    useEffect(() => {
        (() => {
            const allRuns = firebase.app().database()
                .ref(`users/${firebase.app().auth().currentUser?.uid}/runs`)
                .get()
                .then(snapshot => {
                    setRuns(snapshot.val())
                    console.log("test", snapshot.val())
                })
        })()
    }, [])


    const ItemView = ({item}: any) => {
        return (
            // Single Comes here which will be repeatative for the FlatListItems
            <View style={styles.container}>
                <Text onPress={() => getItem(item)}>
                    {item?.time}
                </Text>
            </View>
        );
    };

    const getItem = (item: any) => {
        //Function for click on an item
        alert('Id : ' + item?.time + ' Value : ' + item?.time);
    };

    return (
        <View>
            <FlatList data={runs} renderItem={ItemView}/>

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
