import React, { Component, useState, useEffect } from 'react';
import { fb_db } from '../Firebase';
import { Avatar, ListItem } from 'react-native-elements';
import { collection, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
const ListCustomItem =({id,chatName,enterChat})=> {
  const [chatMessges,setchatMessages]=useState([]);

  useEffect(() => {
    const chatRef = doc(fb_db, 'chats', id);
    const messagesCollectionRef = collection(chatRef, 'messages');
    const orderedMessagesQuery = query(messagesCollectionRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(orderedMessagesQuery, (snapshot) => {
      setchatMessages(snapshot.docs.map((doc) => doc.data()));
    });

    return unsubscribe;
  }, [id]);

    return (
      <ListItem key={id} bottomDivider onPress={()=>enterChat(id,chatName)}>
        <Avatar rounded iconStyle={{backgroundColor:'white'}} 
        source={{uri:chatMessges?.[0]?.photoURL ||
        "https://cdn-icons-png.flaticon.com/128/9386/9386903.png"}}/>
        <ListItem.Content>
            <ListItem.Title style={{fontWeight:"800"}}>
                {chatName}
            </ListItem.Title>
            <ListItem.Subtitle numberOfLines={1} ellipsizeMode='tail'>
                {chatMessges?.[0]?.displayName}:{chatMessges?.[0]?.message}
            </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    )
}

export default ListCustomItem;
