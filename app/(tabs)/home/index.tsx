import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import firebase from "firebase/compat";
import {Link, Redirect} from "expo-router";
import * as Location from "expo-location";
import {LocationAccuracy, LocationGeocodedAddress, LocationObjectCoords, LocationSubscription} from "expo-location";
import Spinner from "react-native-loading-spinner-overlay";
import MapView, {Marker} from "react-native-maps";


export default function App() {
    const [currentLocation, setCurrentLocation] = useState<LocationObjectCoords>();
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [watcher, setWatcher] = useState<LocationSubscription>();
    const [mapRegion, setMapRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
    });
    const [training, setTraining] = useState(false)
    const [running, setRunning] = useState(false)

    useEffect(() => {
        (() => {
            Location.watchPositionAsync({
                accuracy: LocationAccuracy.Highest,
                distanceInterval: 100,
                timeInterval: 10000
            }, ({coords}) => {
                setCurrentLocation(coords);
                setMapRegion(() => {
                    return {
                        latitude: coords.latitude, longitude: coords.longitude, latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }
                })
            }).then((locationWatcher) => {
                setWatcher(locationWatcher);
            }).catch((err) => {
                console.log(err)
            })
        })()
    }, [])

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location.coords);
            setLoading(false)
        })();
    }, []);

    if (training){

    }
    else if (running){
        return (
            <SafeAreaView>
                {loading ? (
                    <View style={styles.container}>
                        <Spinner
                            visible={loading}
                            textContent={'Loading...'}
                            textStyle={styles.spinnerTextStyle}
                        />
                    </View>
                ) : (
                <MapView
                            style={{height: 300}}
                            region={mapRegion}
                        >
                            <Marker coordinate={mapRegion} title='Marker'/>
                        </MapView>
                    )}
            </SafeAreaView>
        )
    }

    if (!errorMsg) {
        return (
            <SafeAreaView style={styles.container}>
                    <View>
                        <Text style={styles.paragraph}>Training</Text>
                        <Button title={"Training Starten"}/>
                        <Text style={styles.paragraph}>Lauf</Text>
                        <Button title={"Lauf Starten"} onPress={() => setRunning(true)}/>
                    </View>
            </SafeAreaView>

        )

    }

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
