import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import firebase from "firebase/compat";
import MapView, {MapMarker, MapPolyline} from "react-native-maps";


export default function App() {
    const [runs, setRuns] = useState<any[]>()
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        (() => {
            firebase.app().database()
                .ref(`users/${firebase.app().auth().currentUser?.uid}/runs`)
                .get()
                .then(snapshot => {
                    setRuns(snapshot.val())
                })
        })()

        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

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
                    <Text style={styles.paragraph}>
                        Lauf Nummer: {runs?.indexOf(item)}

                    </Text>
                    <Text style={styles.smallParagraph}>
                        Laufzeit: {item?.time}

                    </Text>
                    <Text style={styles.smallParagraph}>
                        Durchgeführt am: {item?.timeOfRun}
                    </Text>
                    <MapView
                        style={{height: 200, marginBottom: 50}}
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

    return (
        <SafeAreaView>
            <FlatList data={runs} renderItem={ItemView} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }/>
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
        marginLeft: 30,
        marginRight: 30,
        textAlign: "center",
        fontWeight: "bold"
    },
    heading: {
        marginTop: 20
    },
    spinnerTextStyle: {
        color: '#FFF',
    },
    smallParagraph: {
        fontSize: 12,
        marginLeft: 30,
        marginRight: 30,
        textAlign: "center"
    }
});
