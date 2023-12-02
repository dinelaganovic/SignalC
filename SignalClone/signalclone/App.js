import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator}from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { Text, View, } from 'react-native';
import { useWindowDimensions } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import AddChatScreen from './screens/AddChatScreen';
import ChatScreen from './screens/ChatScreen';

const Stack=createStackNavigator();
const globalScreen={
  headerStyle:{backgroundColor:"#2C6BED"},
  headerTitleStyle:{color:'white'},
  headerTintColor:'white',
}
export default function App() {

  return (
    <NavigationContainer>
    <Stack.Navigator    screenOptions={globalScreen}>
    <Stack.Screen name="Login" options={{headerTitle:LoginHeader}}  component={LoginScreen}/>
    <Stack.Screen name="Register" options={{headerTitle:RegisterHeader}} component={RegisterScreen} />
    <Stack.Screen name="Home"  component={HomeScreen} />
    <Stack.Screen name="AddChat"  component={AddChatScreen} />
    <Stack.Screen name="Chat"  component={ChatScreen} />
    </Stack.Navigator>
 </NavigationContainer>
  );
}

const RegisterHeader =(props)=>{
  const {width}=useWindowDimensions();

  return(
    <View style={{
      justifyContent:'space-between',
      width,
      alignItems:'center',
      }}>
        <Text style={{ textAlign:'center', fontWeight:'bold',fontSize:18, color:'white',paddingRight:160
}}> REGISTER</Text>
      </View>
  )
}
const LoginHeader =(props)=>{
  const {width}=useWindowDimensions();

  return(
    <View style={{
      justifyContent:'space-between',
      width,
      alignItems:'center',
      }}>
        <Text style={{ textAlign:'center', fontWeight:'bold',fontSize:18, color:'white',paddingRight:50
}}> LOGIN</Text>
      </View>
  )
}
