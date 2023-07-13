import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import * as Location from 'expo-location';
import {LocationAccuracy, LocationGeocodedAddress, LocationObjectCoords, LocationSubscription} from 'expo-location';
import Spinner from "react-native-loading-spinner-overlay";
import MapView, {Marker} from "react-native-maps";
import * as child_process from "child_process";
import {getRecommendations} from "./recommendations";
import firebase from "firebase/compat";

export default function App() {
    const [currentLocation, setCurrentLocation] = useState<LocationObjectCoords>();
    const [geocode, setGeocode] = useState<LocationGeocodedAddress[]>();
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState<any>();
    const [watcher, setWatcher] = useState<LocationSubscription>();
    const [mapRegion, setMapRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
    });



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
                getWeather(coords.latitude, coords.longitude).catch((errorMsg) => console.log(errorMsg))
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
        (async () => {
            if (currentLocation) {
                let {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }

                let geocodedAddresses = await Location.reverseGeocodeAsync({
                    longitude: currentLocation.longitude,
                    latitude: currentLocation.latitude
                });
                setGeocode(geocodedAddresses);
            }
        })();
    }, [currentLocation])


    const getWeather = async (latitude: number, longitude:number) => {
        const api_call = await
            fetch(`//api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=406439182dd5d5f377e4b5c34dd8c694&units=metric&lang=de`);
        const data = await api_call.json();
        console.log(data)
        setWeather({
            lat: latitude,
            lon: longitude,
            city: data.name,
            temperatureC: data.main.temp,
            description: data.weather[0].description,
            descriptionID: data.weather[0].id,
        })
    }


    if (!errorMsg) {
        return (
            <SafeAreaView style={styles.container}>
                {loading ? (
                    <View style={styles.container}>
                        <Spinner
                            visible={loading}
                            textContent={'Loading...'}
                            textStyle={styles.spinnerTextStyle}
                        />
                    </View>
                ) : (
                    <View style={styles.container}>
                        <Text>Geocodes</Text>
                        <Text
                            style={styles.paragraph}>Stadt: {geocode?.[0]?.city || "Currently unavailable"}</Text>
                        <Text
                            style={styles.paragraph}>Land: {geocode?.[0]?.country + " (" + geocode?.[0]?.isoCountryCode + ") " || "Currently unavailable"}</Text>
                        <Text
                            style={styles.paragraph}>District: {geocode?.[0]?.district || "Currently unavailable"}</Text>
                        <Text
                            style={styles.paragraph}>PLZ: {geocode?.[0]?.postalCode || "Currently unavailable"}</Text>
                        <Text
                            style={styles.paragraph}>Region: {geocode?.[0].region || "Currently unavailable"}</Text>
                        <Text
                            style={styles.paragraph}>Adresse: {geocode?.[0].street + " " + geocode?.[0].streetNumber || "Currently unavailable"}</Text>
                        <Text
                            style={styles.paragraph}>Zeitzone: {geocode?.[0].timezone || "Currently unavailable"}</Text>
                        <Text style={styles.heading}>Wetter</Text>
                        <Text
                            style={styles.paragraph}>Temperatur: {Math.round(weather.temperatureC) + "°" || "Currently unavailable"}</Text>
                        <Text
                            style={styles.paragraph}>Beschreibung: {weather.description || "Currently unavailable"}</Text>
                        <Text
                            style={styles.paragraph}>Empfehlung: {getRecommendations(weather.descriptionID) || "Currently unavailable"}</Text>

                        <MapView
                            style={{alignSelf: 'stretch', height: '100%'}}
                            region={mapRegion}
                        >
                            <Marker coordinate={mapRegion} title='Marker'/>
                        </MapView>
                    </View>
                )}
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text>{errorMsg}</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
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
});
