import { useNavigation } from '@react-navigation/core';
import { StatusBar } from "expo-status-bar";
import React, { useState,useLayoutEffect } from "react";
import {  StyleSheet, View, KeyboardAvoidingView, TextInput } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import  {fb_auth} from'../Firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const RegisterScreen =()=>{
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password, setPassword]=useState('');
    const [imgUrl,setImgUrl]=useState('');
    const navigation=useNavigation();
    
    useLayoutEffect(()=>{
        navigation.setOptions({
            headerBackTitle:"Back to Login"
        });
    },[navigation]);
    const register =()=>{
        if (!name || !email || !password) {
            alert("All fields are required!");
            return;
        }      
        createUserWithEmailAndPassword(fb_auth,email,password)
        .then((authUser) => {
            updateProfile(authUser.user, {
              displayName: name,
              photoURL: imgUrl || "https://vectorseek.com/wp-content/uploads/2023/10/Signal-Messenger-icon-Logo-Vector.svg-.png",
            });
            navigation.navigate('Login' as never)
        })
        .catch((err)=>alert(err.message));
    };
    return(
        <KeyboardAvoidingView behavior="padding" enabled style={style.page}>
            <StatusBar style="light" />
            <Text h3 style={{marginBottom:50}}>
                Create a SignalC account
            </Text>
             <View style={style.inputContainer}>
                <Input placeholder="Full name"
                 autoFocus 
                 value={name}
                 onChangeText={(text)=>setName(text)}
                 />
                <Input placeholder="Email"
                 autoFocus 
                 value={email}
                 onChangeText={(text)=>setEmail(text)}
                 />
                <Input placeholder="Password"
                 secureTextEntry 
                 value={password}
                 onChangeText={(text)=>setPassword(text)}
                 />
                 <Input placeholder="Profile Picture URL"
                 autoFocus 
                 value={imgUrl}
                 onChangeText={(text)=>setImgUrl(text)}
                 onSubmitEditing={register}
                 />
             </View>
             <Button raised containerStyle={style.button} onPress={register} title="Register"/>
             <View style={{height:100}}/>
        </KeyboardAvoidingView>
    );
};
export default  RegisterScreen;

const style=StyleSheet.create({
    page:{
        padding:10,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white'
    },
    inputContainer:{
        width:300,
    },
    button:{
        width:200,
        marginTop:10,
    }
})