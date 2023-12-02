import { useNavigation } from '@react-navigation/core';
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, FlatList, SafeAreaView, Image, KeyboardAvoidingView,TextInput } from "react-native";
import { Button, Input } from "react-native-elements";
import  {fb_auth} from'../Firebase';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen=()=>{
    const [email,setEmail]=useState('');
    const [password, setPassword]=useState('');
    const navigation=useNavigation();
    const [loading, setLoading] = useState(false);
    
    const signIn =async()=>{
        setLoading(true);
        try{
           const response=await signInWithEmailAndPassword(fb_auth, email,password);
           console.log(response) 
           navigation.reset({
            index: 0,
            routes: [{ name: 'Home' as never}],
          });
        }catch(err){
            alert(err)
        }finally{
            setLoading(false);
        }
    }
    const register =()=>{
        navigation.navigate('Register' as never);
    }
    return(
        <KeyboardAvoidingView behavior="padding" enabled style={style.page}>
            <StatusBar style="light" />
            <Image source={{uri:"https://vectorseek.com/wp-content/uploads/2023/10/Signal-Messenger-icon-Logo-Vector.svg-.png"}}
             style={{width:100, height:100}}
             />
             <View style={style.inputContainer}>
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
             </View>
             <Button containerStyle={style.button} onPress={signIn} title="Login"/>
             <Button containerStyle={style.button} type="outline" onPress={register} title="Register"/>
             <View style={{height:100}}/>
        </KeyboardAvoidingView>
    );
};
export default LoginScreen;
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