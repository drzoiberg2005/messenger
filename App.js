import React, { useEffect, useRef, useState } from 'react'
import { NavBar } from './src/Components/NavBar'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { Auth } from './src/Screens/Auth'
import { AuthContext } from './src/context/AuthContext'
import { useAuth } from './hooks/auth.hooks'
import { ListContacts } from './src/Screens/ListContacts'
import { ListMessages } from './src/Screens/ListMessages'
import { Settings } from './src/Screens/Settings'
import Message from './src/Screens/Message'
import Contact from './src/Screens/Contact'
import { io } from 'socket.io-client'
import { useColorScheme } from 'react-native'
import { darkTheme, defaultTheme } from './src/context/Themes'
import * as Notifications from 'expo-notifications'
import * as Contacts from 'expo-contacts'
import { registerForPushNotificationsAsync } from './scripts/registerPushNot'
const SERVER_URL = 'http://192.168.1.69:5000'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export default function App() {
  const { token, login, logout, userId } = useAuth()
  const isAuthenticated = !!token
  const Stack = createNativeStackNavigator()
  const socketRef = useRef(null)
  const scheme = useColorScheme()
  const [contactsTelephone, setContactsTelephone] = useState([])
  const [contactsCloud, setContactsCloud] = useState([])
  const [rooms, setRooms] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [expoPushToken, setExpoPushToken] = useState('')
  const [userEPT, setUserEPT] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()


  useEffect(async () => {
    const { status } = await Contacts.requestPermissionsAsync()
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync()
      setContactsTelephone(data)
    }
  }, [])

  useEffect(() => {
    socketRef.current = io(SERVER_URL, {
      query: `token=${token}`
    })

    socketRef.current.on('user', (arg) => {
      setContactsCloud(arg.user.contacts)
      setRooms(arg.rooms)
      setMessages([...messages, ...arg.messages])
      setLoading(false)
      setUserEPT(arg.user.expoPushToken)
    })

    socketRef.current.on('message:recive', (arg) => {
      setMessages(arr => [...arr, arg])
    })

    socketRef.current.on('contacts', (findContacts) => {
      if (findContacts.length > 0) {
        setContactsCloud([...contactsCloud, ...findContacts])
      }
    })

    socketRef.current.on('room:create', (arg) => {
      setRooms(arr => [...arr, arg])
    })

    return () => {
      socketRef.current.disconnect()
    }

  }, [token])

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response)
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  useEffect(() => {
    if (expoPushToken && userEPT.indexOf(expoPushToken) === -1) {
      socketRef.current.emit('pushToken', expoPushToken)
    }
  }, [expoPushToken, userEPT])

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated, socketRef
    }}>
      <NavigationContainer
        theme={scheme === 'dark' ? darkTheme : defaultTheme}
      >
        <StatusBar style='auto' />
        <Stack.Navigator
          initialRouteName={isAuthenticated ? 'ListMessages' : 'Auth'}
        >
          {!isAuthenticated ? (
            <Stack.Screen
              name='Auth'
              options={{ headerShown: false }}>
              {(props) => <Auth {...props} expoPushToken={expoPushToken} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen
                name='ListContacts'
                options={{
                  title: 'Контакты'
                }}>
                {(props) => <ListContacts {...props} loading={loading} contactsTelephone={contactsTelephone} contactsCloud={contactsCloud} />}
              </Stack.Screen>
              <Stack.Screen
                name='ListMessages'
                options={{
                  title: 'Сообщения'
                }} >
                {(props) => <ListMessages {...props} messages={messages} rooms={rooms} contactsCloud={contactsCloud} />}
              </Stack.Screen>
              <Stack.Screen
                name='Settings'
                component={Settings}
                options={{
                  title: 'Настройки'
                }} />
              <Stack.Screen
                name='Message'
              >
                {(props) => <Message {...props} messages={messages} setMessages={setMessages} />}
              </Stack.Screen>
              <Stack.Screen
                name='Contact'
              >
                {(props) => <Contact {...props} rooms={rooms} />}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
        {!isAuthenticated ? null : <NavBar />}
      </NavigationContainer>
    </AuthContext.Provider >
  )
}

