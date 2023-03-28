import React, {useState,useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import type {PropsWithChildren} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Icon } from '@rneui/themed';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import QRCodeScanner from 'react-native-qrcode-scanner';


import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

interface info {
  UID:string;
  isVerified:boolean;
  peoples:number;
  place:string;
  tickID:string;
  date: string;
  time:string;
  slot:string;
}
interface Ticket {
  id: string;
  info : info
}

type RootStackParamList = {
  Home: {signedIn:boolean};
  Status: { ticketInfo: info, status: number };
  Login: {setSignedIn: React.Dispatch<React.SetStateAction<boolean>>}
};


type StatusProps = NativeStackScreenProps<RootStackParamList, 'Status'>;
type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;



function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}


GoogleSignin.configure({
  webClientId:
    '421885558820-kcqbllkcd6nc8780farosg025fjpn4r1.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
});

function HomeScreen({route,navigation}:HomeProps):JSX.Element {

  const isDarkMode = useColorScheme() === 'dark';
  const [loggedIn, setloggedIn] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [userInfo, setuserInfo] = useState({});
  const [ticketInfo, setTicketInfo] = useState<Ticket>()
  const [ticketValid, setTicketValid] = useState(false)
  const [isScanVisible, setIsScanVisible] = useState(false)



  useEffect(() => {
    GoogleSignin.isSignedIn()
    .then(res => {
      setloggedIn(res);
    })
    .catch((err) => {
        console.log(err);
        
    });
  },[]);


  const toggleDialog1 = () => {
    setVisible1(!visible1);
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  

  const handleScanner = () => {
      setIsScanVisible(true)
  }

  const compare = (timestamp:string) => {
    const currDate = new Date()
    
    if(timestamp !== currDate.toDateString()) return -1;
    return 1;
  }


  const onSuccess = async (e:any) => {
    let flag = false,verified = false;
    let docID = ""
    let data:info;
    let status:number
    let timestamp= ""
    const tickList = await firestore().collection('Tickets').doc('TickIDs').get();
    if(tickList.data()){
      tickList.data()?.ID.map((key:string,val:number)=> {
        if(e.data == key) {
          setTicketValid(true)
          flag = true
        }
      })
    }
    if(!flag){
      Alert.alert('Invalid Ticket', 'This Ticket is not issued to anyone', [
        {
          text: 'Cancel',
          onPress: () => setIsScanVisible(false),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => setIsScanVisible(false)},
      ]);
  
    }
    else {
      const ticketData = await firestore().collection("Tickets").where("tickID","==",e.data).get()
      if(!ticketData.empty){
        ticketData.docs.map((doc) => {
            data = doc.data() as info
            docID = doc.id
            verified = data.isVerified
            timestamp = data.date
            setTicketInfo({
              id: doc.id,
              info: data
            })
          })
      }

      
      if(verified ||  (ticketInfo &&  ticketInfo?.info?.isVerified)){
        status = 2
      }
      else if(compare(timestamp) == -1){
        status = 3
      }
      else {        
        if(docID){
          const upd = await firestore().collection("Tickets").doc(docID).update({
            isVerified:true
          })
          // toggleDialog1()
          status = 1
          data.isVerified = true

          
          // if(ticketInfo?.info){
            // }
          }
        } 
      setIsScanVisible(false)
      navigation.navigate("Status",{
        ticketInfo:data,
        status:status
      })
    }
  }

  return (
      <SafeAreaView style={{flex:1,justifyContent:'center',backgroundColor:'#363636'}}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        {/* <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{backgroundColor:'#363636'}}> */}
          <View
            style={{
              flex:1,
              justifyContent: 'center',
              alignItems: 'center', 
              backgroundColor: isDarkMode ? '#363636' : Colors.white,
            }}>
              {!isScanVisible && (
                <Pressable style={{
                  justifyContent: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 32,
                  borderRadius: 15,
                  elevation: 3,
                  backgroundColor: '#55c2da',
                }} onPress={handleScanner}>
                  <Text style={{
                    fontSize: 16,
                    lineHeight: 21,
                    fontWeight: 'bold',
                    letterSpacing: 0.25,
                    color: 'white',
                  }}>Verify Identity</Text>
                </Pressable>
              )}
              {isScanVisible && (
                <QRCodeScanner
                onRead={onSuccess}
                // flashMode={RNCamera.Constants.FlashMode.torch}
                topContent={
                  <Text style={styles.centerText}>
                    Scan the QR code.
                  </Text>
                }
                // bottomContent={
                //     // <Text style={styles.buttonText}>OK. Got it!</Text>
                //   // <TouchableOpacity style={styles.buttonTouchable}>
                //   // </TouchableOpacity>
                // }
              />
              )}
              
          </View>
        {/* </ScrollView>/ */}
      </SafeAreaView>
  );
}


function StatusScreen({route,navigation}:StatusProps):JSX.Element {
  const {ticketInfo,status} = route.params;
  const [color, setColor] = useState("green")
  useEffect(() => {
    if(status == 1) {
      setColor("green")
    }
    else {
      setColor("red")
    }
  },[status])

  
  
  return(
    <View style={{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#363636',
    }}>

    <Text style={{
        color:color,
        fontWeight:'bold',
        fontSize:20,
        marginBottom:4,
      }}
    >
      {status == 1 ? "Verified Successfully" : status == 2 ? "verification already done":"Date is not today"}
    </Text>

      {ticketInfo &&  (
                <>
                  <Text style={{fontSize:20}}> Status : {ticketInfo?.isVerified == true ? "Verified":"Unverified"}</Text>
                  <Text style={{fontSize:20}}>Peoples : {ticketInfo?.peoples}</Text>
                  <Text style={{fontSize:20}}>Place : {ticketInfo?.place}</Text>
                  <Text style={{fontSize:20}}> TicketID : {ticketInfo?.tickID}</Text>
                  <Text style={{fontSize:20}}>Date : {ticketInfo?.date}</Text>
                  <Text style={{fontSize:20}}>Timing : {ticketInfo?.time}</Text>
                  <Text style={{fontSize:20}}>Slot : {ticketInfo?.slot}</Text>
                </>)}

    </View>
  )
}


function LoginScreen({route,navigation}:LoginProps):JSX.Element {
  
  const {setSignedIn} = route.params
  const isDarkMode = useColorScheme() === 'dark';

  const handlePress = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();

      setSignedIn(true)
      
    } catch (error:any) {
      console.log(error);
    }
  }
  return(
    <View
      style={{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: isDarkMode ? '#363636' : Colors.white,
      }}
    >
      <GoogleSigninButton
        style={{ width: 192, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handlePress}
        />
    </View>
  )
}

const Stack = createStackNavigator<RootStackParamList>();


function App(): JSX.Element {
    const [loggedIn, setloggedIn] = useState(false)


    const isSignedIn = async () => {
      const isSignedIn = await GoogleSignin.isSignedIn();
      setloggedIn(isSignedIn);
    };


    useEffect(() => {
      isSignedIn();
    },[])
    const signOut = async () => {
      try {
        await GoogleSignin.signOut();
        setloggedIn(false)
      } catch (error) {
        console.error(error);
      }
    };
    return(
      <NavigationContainer>
        <Stack.Navigator>
          {loggedIn ? (
          <>
            <Stack.Screen 
              name="Home" 
              options={{
                title: 'Home',
                headerRight: () => loggedIn && (
                  <Icon
                    name='logout'
                    color="#fff"
                    onPress={signOut}
                  />
                ),
                headerRightContainerStyle:{
                  padding:15
                },
                headerStyle: {
                  backgroundColor: '#f4511e',
                },
                headerTitleAlign:'center',
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
              initialParams = {{
                signedIn:loggedIn
              }}
            >
              {(props:any) => <HomeScreen {...props}/>}
            </Stack.Screen>
            <Stack.Screen 
              name="Status"
              options={{
                title: 'Status',
                headerStyle: {
                  backgroundColor: '#f4511e',
                },
                headerTitleAlign:'center',
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
            {(props:any) => <StatusScreen {...props} />}
            </Stack.Screen> 
          </>
          ):(
            <Stack.Screen 
              name="Login"
              options={{
                title: 'Login',
                headerStyle: {
                  backgroundColor: '#f4511e',
                },
                headerTitleAlign:'center',
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
              initialParams = {{
                setSignedIn:setloggedIn
              }}
            >
            {(props:any) => <LoginScreen {...props} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  }
});

export default App;
