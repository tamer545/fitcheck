import {Redirect} from "expo-router";
import React, {useState} from "react";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {Button, SafeAreaView, StyleSheet, Text, TextInput} from "react-native";
import firebase from "firebase/compat";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = () => {
    return <Redirect href="/"/>;
}