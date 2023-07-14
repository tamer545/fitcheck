import React, {useEffect, useState} from 'react';
import {Button, Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
// @ts-ignore
import {Stopwatch, Timer} from 'react-native-stopwatch-timer';
import * as Location from "expo-location";
import {LocationAccuracy, LocationObject, LocationSubscription} from "expo-location";
import Spinner from "react-native-loading-spinner-overlay";
import MapView, {MapMarker, MapPolyline} from "react-native-maps";
import {Pedometer} from "expo-sensors";

import firebase from "firebase/compat";

const ImageSelect = ({name}: { name: string }) => {
    switch (name) {
        case "Liegestützen":
            return <Image style={styles.image}
                          source={require("../../../assets/images/liegestuetzen.png")}/>
        case "Kniebeugen":
            return <Image style={styles.image}
                          source={require("../../../assets/images/knieBeugen.png")}/>
        case "Hampelmänner":
            return <Image style={styles.image}
                          source={require("../../../assets/images/jumpingJacks.png")}/>
        case "Planks":
            return <Image style={styles.image} source={require("../../../assets/images/planks.png")}/>
        case "Rumpfbeugen":
            return <Image style={styles.image}
                          source={require("../../../assets/images/rumpfbeugen.png")}/>
        default:
            return <View />
    }
}

export default function App() {
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
    const [initialLocation, setInitialLocation] = useState<LocationObject>()
    const [running, setRunning] = useState(false)
    const [isStopwatchStart, setIsStopwatchStart] = useState(false);
    const [resetStopwatch, setResetStopwatch] = useState(false);
    const [trainingsplan, setTrainingsplan] = useState<Array<{ Dauer: number, name: string, img: string }>>();

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [task, setTask] = useState(-1);
    const [runningCoords, setRunningCoords] = useState<{ latitude: number, longitude: number }[]>([])
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [pastStepCount, setPastStepCount] = useState(0);
    const [currentStepCount, setCurrentStepCount] = useState(0);
    const [currentTime, setCurrentTime] = useState("");
    const [timer, setTimer] = useState<NodeJS.Timer>();

    useEffect(() => {
        if (!initialLocation)
            return
        (() => {
            Location.watchPositionAsync({
                accuracy: LocationAccuracy.Highest,
                timeInterval: 5000,
                distanceInterval: 1
            }, ({coords}) => {
                setMapRegion(() => {
                    return {
                        latitude: coords.latitude, longitude: coords.longitude, latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }
                })
                setRunningCoords((runningCoords) => {
                    return [...runningCoords, {latitude: coords.latitude, longitude: coords.longitude}]
                })
            }).then((locationWatcher) => {
                setWatcher(locationWatcher);
            }).catch((err) => {
                console.log(err)
            })
        })();

        return () => watcher?.remove()
    }, [initialLocation])

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setInitialLocation(location);
            setRunningCoords([{latitude: location.coords.latitude, longitude: location.coords.longitude}])
            setLoading(false)
        })();
    }, []);

    useEffect(() => {
        while (seconds > 60) {
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

    useEffect(() => {
        const subscription = subscribe();
        return () => {
            subscription && subscription.then((value) => value?.remove())
        };
    }, []);

    function nextTask() {
        let newTask = task + 1;
        setTask(newTask);
        if (trainingsplan && trainingsplan.length > newTask) {
            setSeconds(trainingsplan[newTask].Dauer)
        } else if (trainingsplan && trainingsplan.length === newTask) {
            clearInterval(timer);
            setTraining(false)
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
                    if (task > 0) {
                        setSeconds(snapshot.val()[0].Dauer);
                        setTask(0);
                    }else {
                        setSeconds(snapshot.val()[task].Dauer);
                    }
                    setTimer(setInterval(newSecond, 1000));
                }
            )
        })
        setTraining(true);
    }

    const subscribe = async () => {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(String(isAvailable));

        if (isAvailable) {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 1);

            const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
            if (pastStepCountResult) {
                setPastStepCount(pastStepCountResult.steps);
            }

            return Pedometer.watchStepCount((result: any) => {
                setCurrentStepCount(result.steps);
            });
        }
    };

    const getNumberOfRuns = async () => {
        const snapshot = await firebase.app().database()
            .ref(`users/${firebase.app().auth().currentUser?.uid}/runs`)
            .get()
        return snapshot.numChildren()
    }

    if (training) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.paragraph}>
                    {minutes} : {seconds}
                </Text>
                <Text style={styles.paragraph}>
                    {trainingsplan ? trainingsplan[task]?.name : ""}
                </Text>
                <ImageSelect name={trainingsplan ? trainingsplan[task]?.name : ""} />
                <Button title={"Training beenden"} onPress={() => {
                    clearInterval(timer);
                    setTraining(false);
                }}/>
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
                            zoomEnabled={false}
                        >
                            <MapPolyline
                                coordinates={runningCoords || [{longitude: 0, latitude: 0}]}
                                strokeWidth={10}
                                strokeColor="#00a8ff"
                            />
                            <MapMarker coordinate={{
                                longitude: initialLocation?.coords.longitude || 0,
                                latitude: initialLocation?.coords.latitude || 0
                            }}/>
                        </MapView>
                        <Button title={"Lauf beenden"} onPress={async () => {
                            await firebase.app().database()
                                .ref(`users/${firebase.app().auth().currentUser?.uid}/runs/${await getNumberOfRuns() + 1}`)
                                .set({
                                    runningCoords: runningCoords,
                                    steps: currentStepCount,
                                    time: currentTime,
                                    region: mapRegion,
                                    timeOfRun: new Date().toLocaleString()
                                })
                            setRunning(false)
                            setIsStopwatchStart(false);
                            setResetStopwatch(true);
                            setRunningCoords([])
                            setCurrentStepCount(0)
                        }}/>
                        <View style={styles.sectionStyle}>
                            <Stopwatch
                                laps
                                start={isStopwatchStart}
                                reset={resetStopwatch}
                                options={options}
                                getTime={(time: any) => setCurrentTime(time)}
                            />
                            <Text style={styles.buttonText}>Schritte</Text>
                            <Text>{currentStepCount}</Text>
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
                    <Text style={styles.paragraph}>Um den Trainingsplan zu ändern gehe in die Einstellungen</Text>
                    <Button title={"Training Starten"} onPress={() => {

                        startTraining()
                    }}/>
                    <Text style={styles.paragraph}>Lauf</Text>
                    <Button title={"Lauf starten"} onPress={() => {
                        setRunning(true)
                        setIsStopwatchStart(true);
                        setResetStopwatch(false);
                    }
                    }/>
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
    }, sectionStyle: {
        marginTop: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 20,
        marginTop: 10,
    },
    image: {
        width: 400,
        height: 300
    }
})


const options = {
    container: {
        backgroundColor: '#505050',
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