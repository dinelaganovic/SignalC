import React, { Component, useLayoutEffect } from 'react';
import {useState,useEffect} from "react";
import { TextInput, Pressable, Platform} from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements';
import {  FontAwesome, Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { SafeAreaView, StyleSheet, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { fb_db,fb_auth, ref, uploadString } from '../Firebase';
import { collection, doc, addDoc,where, serverTimestamp, query, orderBy, onSnapshot, snapshotEqual } from 'firebase/firestore';
import { Image } from 'react-native';
import {  fb_storage } from '../Firebase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function ChatScreen({navigation,route}){
    const [message, setMessage]=useState('');
    const [messages, setMessages]=useState([]);
    const [isImageSelected, setIsImageSelected] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [image, setImage] = useState(null);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1,
        });      
        if (!result.cancelled) {
          setSelectedImage(result.uri);
          console.log(result.uri); // Provera URI-ja
          setImage(result.uri);
          setIsImageSelected(true);
        }
      };
  
      const uploadImage = async (uri) => {
        try {
          const storageRef = ref(fb_storage, 'images/' + Math.random().toString(36).substring(7));
      
          // Use expo-file-system to read the file and convert it to base64
          const fileInfo = await FileSystem.getInfoAsync(uri);
          const base64Data = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      
          await uploadString(storageRef, `data:${fileInfo.mimeType};base64,${base64Data}`, 'data_url');
      
          const downloadURL = await storageRef.getDownloadURL();
          console.log('Image uploaded. Download URL:', downloadURL);
      
          await addDoc(collection(fb_db, 'images'), {
            imagePath: downloadURL,
            owner: fb_auth.currentUser?.uid,
            timestamp: serverTimestamp(),
          });
        } catch (error) {
          //console.error('Error uploading image:', error);
        }
      };
      
  
    const sendMessage = async () => {
        Keyboard.dismiss();
        try {
          const chatRef = doc(fb_db, 'chats', route.params.id);
          const messagesCollectionRef = collection(chatRef, 'messages');
      
          if (image) {
            await uploadImage(image);
            setImage(null);
          }
          if (message || image) {
            await addDoc(messagesCollectionRef, {
              timestamp: serverTimestamp(),
              message: message,
              imageUrl: image,
              displayName: fb_auth.currentUser?.displayName,
              email: fb_auth.currentUser?.email,
              photoURL: fb_auth.currentUser?.photoURL,
            });
            setMessage('');
            setSelectedImage(null);
          }
        } catch (error) {
          console.error('Error sending message:', error);
        }
      };
      
    
    const onPlusClicked=()=>{
        alert("You cannot send an empty message. Enter text!")
    }
    const onPress= ()=>{
        if(message || image){
            sendMessage();
        }else{
            onPlusClicked();
        }
    }
    
      
    ///rendering messages
    useLayoutEffect(() => {
        const chatId = route.params.id;
    
        const messagesCollectionRef = collection(fb_db, 'chats', chatId, 'messages');
        const messagesQuery = query(messagesCollectionRef, orderBy('timestamp', 'asc'));
    
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
        return unsubscribe;
      }, [route]);

      ///heder
    React.useLayoutEffect(()=>{
        navigation.setOptions({
            title:'Chat',
            //headerBackTitleVisible:false,
            headerTitleAlign:"left",
            headerTitle:(props)=>{
                const {width}=useWindowDimensions();
      
                return(
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:width-25,
                     marginLeft:25,
                     paddingRight:70,alignItems:'center'
                    }}>
                    <Avatar 
                    rounded 
                    source={{uri:messages[0]?.data.photoURL}}
                    />
                    <Text style={{flex:1,marginLeft:10,fontWeight:'bold', color:'white'}}>{route.params.chatName}</Text>
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={24} color="white" style={{marginHorizontal:10}}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="call" size={24} color="white" style={{marginHorizontal:10}} />
                    </TouchableOpacity>
                    </View>
                )
            }
        })
    },[navigation,messages]);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView keyboardVerticalOffset={90} style={styles.container}>
        <>
          <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
            {messages.map(({ id, data }) => (
              <View key={id} style={data.email === fb_auth.currentUser?.email ? styles.rec : styles.send}>
                <Avatar
                  position="absolute"
                  rounded
                  size={30}
                  containerStyle={{
                    position: 'absolute',
                    bottom: -15,
                    right: -5,
                  }}
                  source={{
                    uri: data.photoURL,
                  }}
                />
                {data.message && <Text style={data.email === fb_auth.currentUser?.email ? styles.resiverText : styles.senderText}>{data.message}</Text>}
                {data.imageUrl && <Image source={{ uri: data.imageUrl }} style={{ width: 200, height: 200 }} />}
                {data.displayName && <Text style={styles.senderName}>{data.displayName}</Text>}
              </View>
            ))}
          </ScrollView>

          <View style={styles.root}>
            <View style={styles.inputContainer}>
              <AntDesign name="message1" size={24} color="black" />
              <TextInput style={styles.input} placeholder="Signal message..." value={message} onChangeText={setMessage} />
              <View>
                {!isImageSelected && <Feather onPress={pickImage} name="camera" size={24} color="#595959" style={styles.icon} />}
                {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200, borderRadius: 10 }} />}
              </View>
            </View>
            <Pressable onPress={onPress} style={styles.buttonContainer}>
              {message ? <Ionicons name="send" size={18} color="white" /> : <AntDesign name="plus" size={24} color="white" />}
            </Pressable>
          </View>
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
    )
}
const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    root:{
        flexDirection:'row',
        padding:10,
    },
    inputContainer:{
        backgroundColor:'#f2f2f2',
        flex:1,
        marginRight:10,
        borderRadius:25,
        borderWidth:1,
        borderColor:'#dedede',
        alignItems:'center',
        flexDirection:'row',
        padding:5,
        paddingRight:5
    },
    buttonContainer:{
        width:40,
        height:40,
        backgroundColor:'#3777f0',
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonText:{
        color:'white',
        fontSize:35,
    },
    input:{
        flex:1,
        marginHorizontal:5,
    },
    icon:{
        marginHorizontal:5,
    },
    resiverText:{
        color:'black',
        fontWeight:'500',
        marginLeft:10
    },
    senderText:{
        color:'white',
        fontWeight:'500',
        marginLeft:10,
        marginBottom:15,
    },
    rec:{
        padding:15,
        backgroundColor:'#ECECEC',
        alignSelf:'flex-end',
        borderRadius:20,
        marginRight:15,
        marginBottom:20,
        maxWidth:'80%',
        position:'relative'
    },
    send:{
        padding:15,
        backgroundColor:'#2B68E6',
        alignSelf:'flex-start',
        borderRadius:20,
        margin:15,
        maxWidth:'80%',
        position:'relative'
    },
    senderName:{
        left:10,
        paddingRight:10,
        fontSize:10,
        color:'white'
    },
    resiverName:{

    }
})
