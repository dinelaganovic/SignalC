import React,{useState} from 'react';
import { Text, View, StyleSheet } from 'react-native'
import { Button, Input } from 'react-native-elements';
import Icon from "react-native-vector-icons/FontAwesome";
import { fb_db } from '../Firebase';
import { collection, addDoc } from 'firebase/firestore';

const AddChatScreen=({navigation})=> {
    const [input, setInput]=useState('');

    React.useLayoutEffect(()=>{
        navigation.setOptions({
            title:'Add a new Chat',
            headerTintColor:'black',
            headerBackTitle:'Chats'
            //headerTitle:HomeHeader,
        })
    });
    const createChat=async()=>{
        try {
            const docRef = await addDoc(collection(fb_db, 'chats'), {
              chatName: input,
            });
            
            console.log('Document written with ID: ', docRef.id);
            navigation.goBack();
          } catch (err) {
            console.error('Error adding document: ', err);
            alert(err);
          }
    }
    return (
    <View style={style.container}>
        <Input
        placeholder='Enter a chat name'
        value={input}
        onChangeText={(text)=>setInput(text)}
        onSubmitEditing={createChat}
        leftIcon={
            <Icon name='wechat' size={24} color='black' />
        }
        />
        <Button disabled={!input} title='Create Chat' onPress={createChat} />        
    </View>
    )
  }

  export default AddChatScreen;

const style= StyleSheet.create({
    container:{
      padding:20
    }
});