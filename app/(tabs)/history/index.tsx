import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import firebase from "firebase/compat";
import MapView, {MapMarker, MapPolyline} from "react-native-maps";


export default function App() {
    const [runs, setRuns] = useState<any[]>()


    useEffect(() => {
        (() => {
            firebase.app().database()
                .ref(`users/${firebase.app().auth().currentUser?.uid}/runs`)
                .get()
                .then(snapshot => {
                    setRuns(snapshot.val())
                })
        })()
    }, [])


    const ItemView = ({item}: any) => {
        console.log(runs)
        if (item) {
            return (
                // Single Comes here which will be repeatative for the FlatListItems
                <View>
                    <Text style={styles.paragraph} onPress={() => getItem(item)}>
                        Lauf Nummer: {runs?.indexOf(item)} Laufzeit: {item?.time}
                    </Text>
                    <MapView
                        style={{height: 200, margin: 30}}
                        region={item?.region}
                    >
                        <MapPolyline
                            coordinates={item?.runningCoords || [{longitude: 0, latitude: 0}]}
                            strokeWidth={10}
                            strokeColor="#00a8ff"
                        />
                    </MapView>
                </View>
            );
        }
        return (
            <View>

            </View>
        )
    };

    const getItem = (item: any) => {
        //Function for click on an item
        alert('Zeit : ' + item?.time + ' Schritte : ' + item?.steps);
    };

    return (
        <SafeAreaView>
            <FlatList data={runs} renderItem={ItemView}/>

        </SafeAreaView>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    paragraph: {
        fontSize: 15,
        marginTop: 30,
        marginLeft: 30,
        marginRight: 30,
        textAlign: "center"
    },
    heading: {
        marginTop: 20
    },
    spinnerTextStyle: {
        color: '#FFF',
    },
});
