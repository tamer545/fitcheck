import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import firebase from "firebase/compat";
import {Link, Redirect} from "expo-router";
import * as Location from "expo-location";
import {LocationAccuracy, LocationGeocodedAddress, LocationObjectCoords, LocationSubscription} from "expo-location";
import Spinner from "react-native-loading-spinner-overlay";
import MapView, {Marker} from "react-native-maps";

// @ts-ignore
import { Stopwatch } from 'react-native-stopwatch-timer';



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
    const [isStopwatchStart, setIsStopwatchStart] = useState(false);
    const [resetStopwatch, setResetStopwatch] = useState(false);

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
                        latitude: coords.latitude, longitude: coords.longitude, latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
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

    if (training) {

    } else if (running) {
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
                    <View>
                        <MapView
                            style={{height: 300}}
                            region={mapRegion}
                        >
                        </MapView>
                        <Button title={"Lauf beenden"} onPress={() => setRunning(false)}/>
                        <View style={styles.sectionStyle}>
                            <Stopwatch
                                laps
                                msecs
                                start={isStopwatchStart}
                                //To start
                                reset={resetStopwatch}
                                //To reset
                                options={options}
                                //options for the styling
                                getTime={(time: any) => {
                                    console.log(time);
                                }}
                            />
                            <TouchableHighlight
                                onPress={() => {
                                    setIsStopwatchStart(!isStopwatchStart);
                                    setResetStopwatch(false);
                                }}>
                                <Text style={styles.buttonText}>
                                    {!isStopwatchStart ? 'START' : 'STOP'}
                                </Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => {
                                    setIsStopwatchStart(false);
                                    setResetStopwatch(true);
                                }}>
                                <Text style={styles.buttonText}>RESET</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
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
                    <Button title={"Lauf starten"} onPress={() => setRunning(true)}/>
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
    sectionStyle: {
        flex: 1,
        marginTop: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 20,
        marginTop: 10,
    },
});

const options = {
    container: {
        backgroundColor: '#FF0000',
        padding: 5,
        borderRadius: 5,
        width: 200,
        alignItems: 'center',
    },
    text: {
        fontSize: 25,
        color: '#FFF',
        marginLeft: 7,
    },
};