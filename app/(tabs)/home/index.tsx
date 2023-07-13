import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import * as Location from "expo-location";
import {LocationAccuracy, LocationGeocodedAddress, LocationObjectCoords, LocationSubscription} from "expo-location";
import Spinner from "react-native-loading-spinner-overlay";
import MapView, {Marker} from "react-native-maps";

// @ts-ignore
import {Stopwatch, Timer} from 'react-native-stopwatch-timer';
import firebase from "firebase/compat";

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
    const [trainingsplan, setTrainingsplan] = useState<Array<{ Dauer: number, name: string, img: string }>>();

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [task, setTask] = useState(-1);
    const [done, setDone] = useState(false);

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

    useEffect(() => {
        while (seconds >= 60) {
            setSeconds(seconds => seconds - 60)
            setMinutes(minutes => minutes + 1)
        }
        if (seconds === 0) {
            if (minutes === 0) {
                nextTask()
            } else {
                setMinutes(minutes => minutes - 1)
                setSeconds(60)
            }
        }
    }, [seconds])

    function nextTask() {
        setTask(task => task + 1);
        console.log(trainingsplan?.length)
        console.log(task)
        if (trainingsplan && trainingsplan.length > task) {
            setSeconds(trainingsplan[task].Dauer)
        } else if(trainingsplan && trainingsplan.length === task){
            setDone(true);
        }
    }

    function newSecond() {
        setSeconds(seconds => seconds - 1)
    }

    function startTraining() {
        firebase.app().database()
            .ref(`users/${firebase.app().auth().currentUser?.uid}/details`)
            .get().then(snapshot => {
            firebase.app().database()
                .ref(`trainings/${snapshot.val().trainingsplan}`)
                .get().then(snapshot => {
                    setTrainingsplan(snapshot.val())
                    setSeconds(snapshot.val()[task].Dauer);
                    setInterval(newSecond, 1000);
                }
            )
        })
        setTraining(true);
    }

    if (done){
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.paragraph}>
                    Well Done!
                </Text>
            </SafeAreaView>
        )
    }

    if (training) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.paragraph}>
                    {minutes} : {seconds}
                </Text>
                <Text style={styles.paragraph}>
                    {trainingsplan ? trainingsplan[task].name : ""}
                </Text>
            </SafeAreaView>
        )
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
                    <Button title={"Training Starten"} onPress={() => startTraining()}/>
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