import * as React from 'react';
import { useState, } from 'react';
import {View, Text,StyleSheet, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import { useWindowDimensions,Image, TextInput } from 'react-native';
import ListCustomItem from '../components/ListCustomItem';
import { Avatar } from 'react-native-elements';
import { fb_auth, fb_db } from '../Firebase';
import { Feather } from '@expo/vector-icons';
import { collection,onSnapshot } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';

const HomeScreen=({ navigation}) =>{
    const [chats, setChats]=useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [isTextInputVisible, setIsTextInputVisible] = useState(false);
    const [isCloseIconVisible, setIsCloseIconVisible] = useState(false);
    const isFocused = useIsFocused();
    const {width}=useWindowDimensions();

    const handleSearchIconClick = () => {
    setIsTextInputVisible(true);
    setIsSearchMode(true);
    setIsCloseIconVisible(true);
    };

    const handleCloseIconClick = () => {
    setIsTextInputVisible(false);
    setIsSearchMode(false);
    setIsCloseIconVisible(false);
    };
    const signOut=()=>{
        fb_auth.signOut().then(()=>{
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' as never}],
              });
        })
    }
    React.useLayoutEffect(()=>{
        navigation.setOptions({
            title:'Signal',
            headerStyle:{backgroundColor:"#fff"},
            headerTintColor:'black',
            headerTitle:HomeHeader,
        })
    })
    const HomeHeader =(props)=>{
        const {width}=useWindowDimensions();
      
        return(
          <View style={{flexDirection:'row',justifyContent:'space-between',width,
          padding:10,alignItems:'center'
          }}>
            <TouchableOpacity onPress={signOut} activeOpacity={0.5}>
                <Avatar rounded source={{uri: fb_auth?.currentUser?.photoURL ?? 'default_image_url'}}/>
            </TouchableOpacity>
            <Text style={{flex:1, textAlign:'center',marginLeft:40, fontWeight:'bold'}}> Signal</Text>
            {isTextInputVisible ? (
        <TextInput
          placeholder="Pretraži četove"
          style={{
            flex: 1,
            height: 40,
            backgroundColor: '#f2f2f2',
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          value={searchInput}
          onChangeText={(text) => setSearchInput(text)}
        />
      ) : (
        <TouchableOpacity onPress={handleSearchIconClick} activeOpacity={0.5}>
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
      )}

      {isCloseIconVisible && (
        <TouchableOpacity onPress={handleCloseIconClick} activeOpacity={0.5}>
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>
      )}
            <TouchableOpacity onPress={()=>navigation.navigate('AddChat')} activeOpacity={0.5}>
                <Feather name="edit-2" size={24} color="black" style={{marginHorizontal:10}} />
            </TouchableOpacity>
            
          </View>
        )
      }
      React.useEffect(()=>{
        const unsubscribe = onSnapshot(collection(fb_db, 'chats'), (snapshot) => {
          if (snapshot.docs) {
            setChats(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            );
          }
        });
        if (!isFocused) {
          // Postavi isTextInputVisible na false kada se pređe na drugu stranicu
          setIsTextInputVisible(false);
          setIsCloseIconVisible(false);
        }
        return unsubscribe;
      },[isFocused]);

  const enterChat=(id,chatName)=>{
    navigation.navigate('Chat',{
      id,
      chatName
    })
      }
  const filteredChats = chats.filter(({ data }) =>
  data.chatName.toLowerCase().includes(searchInput.toLowerCase())
);
  return (
   <SafeAreaView >
    <ScrollView style={styles.page}>
    {filteredChats.map(({ id, data: { chatName } }) => (
        <ListCustomItem key={id} id={id} chatName={chatName} enterChat={enterChat} />
      ))}
    </ScrollView>
   </SafeAreaView>
  );
}
export default HomeScreen;
const styles=StyleSheet.create({
  page:{
    height:'100%',
  },
}
)